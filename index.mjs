// index.mjs – LYXso API (Fastify + Supabase)

import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { createClient } from "@supabase/supabase-js";

// ROUTES
import accountingRoutes from "./routes/accounting.mjs";
import addonsRoutes from "./routes/addons.mjs";
import aiAgentRoutes from "./routes/aiAgent.mjs";
import marketingRoutes from "./routes/marketing.mjs";
import bookingsAndCustomersRoutes from "./routes/bookingsAndCustomers.mjs";
import servicesEmployeesProductsRoutes from "./routes/servicesEmployeesProducts.mjs";
import coatingAndOrgRoutes from "./routes/coatingAndOrg.mjs";
import adminOrgsRoutes from "./routes/adminOrgs.mjs";

// ✅ NY: SEO-ruter
import seoRoutes from "./routes/seo.mjs";

// Partner / org / onboarding-ruter
import { registerOrgOnboardingRoutes } from "./routes/orgOnboarding.mjs";
import { registerPublicPartnerRoutes } from "./routes/registrerPartner.mjs";
import { registerPartnerAdminRoutes } from "./routes/partnerAdmin.mjs";
import { registerPartnerLandingPageRoutes } from "./routes/partnerLandingPage.mjs";

// Opprett org fra /register-signup
import createOrgFromSignupRoutes from "./routes/createOrgFromSignup.mjs";

// --------------------------------------------------------------------

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

// Supabase (service role)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  app.log.error("Supabase config mangler");
  throw new Error("Supabase config mangler i miljøvariabler");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper for Supabase-error
// NB: Kan kalles både som:
//   handleSupabaseError(reply, "kontekst", error)
//   handleSupabaseError(reply, error, "kontekst")
function handleSupabaseError(reply, arg1, arg2) {
  let context;
  let error;

  // Variant: handleSupabaseError(reply, "context", errorObj)
  if (typeof arg1 === "string" && arg2 && typeof arg2 === "object") {
    context = arg1;
    error = arg2;
  }
  // Variant: handleSupabaseError(reply, errorObj, "context")
  else if (arg1 && typeof arg1 === "object" && typeof arg2 === "string") {
    error = arg1;
    context = arg2;
  }
  // Variant: bare error
  else if (arg1 && typeof arg1 === "object" && arg2 == null) {
    error = arg1;
    context = undefined;
  }
  // Variant: bare context-string
  else if (typeof arg1 === "string" && arg2 == null) {
    context = arg1;
    error = undefined;
  } else {
    // Fallback – prøv å gjette
    error = arg1;
    context = arg2;
  }

  const message =
    (error && error.message) ??
    (typeof error === "string" ? error : "Ukjent Supabase-feil");

  app.log.error({ error: message }, `Supabase error: ${context}`);

  return reply.code(500).send({
    error: context ?? "Feil i Supabase",
    details: message,
  });
}

// Helper function to get orgId from request params or environment
function getOrgId(request) {
  const { orgId } = request.params || {};

  if (orgId && typeof orgId === "string" && orgId.trim()) {
    return orgId.trim();
  }

  // Fallback til ORG_ID fra miljøvariabler (brukes for enkelt-org-oppsett)
  if (process.env.ORG_ID) {
    return process.env.ORG_ID;
  }

  return null;
}

app.decorate("supabase", supabase);
app.decorate("handleSupabaseError", handleSupabaseError);
app.decorate("getOrgId", getOrgId);

app.get("/health", async () => {
  return { ok: true, service: "LYXso API" };
});

// ------------------------------------------------------------
// REGISTRER PARTNER-/ORG-RELATERTE RUTER
// ------------------------------------------------------------

// 1) Org-onboarding / BRREG-lookups + /api/partners/onboard
registerOrgOnboardingRoutes(app, supabase, handleSupabaseError);

// 2) Offentlig "Bli partner" → lagrer i partner_signups
registerPublicPartnerRoutes(app, supabase, handleSupabaseError);

// 3) Admin-ruter for å se/godkjenne partner_signups og styre partnere
registerPartnerAdminRoutes(app, supabase, handleSupabaseError);

// 5) Offentlig /api/public/create-org-from-signup (fra /register-flow)
await createOrgFromSignupRoutes(app);

// ------------------------------------------------------------
// REGISTER ØVRIGE ROUTES I KORREKT REKKEFØLGE
// ------------------------------------------------------------

await accountingRoutes(app);
await addonsRoutes(app);
await aiAgentRoutes(app);
await marketingRoutes(app);

// ✅ NY: SEO-modulen (API under /api/seo/…)
await seoRoutes(app);

await bookingsAndCustomersRoutes(app);
await servicesEmployeesProductsRoutes(app);
await coatingAndOrgRoutes(app);
await adminOrgsRoutes(app);

// ---------------- PARTNER BRREG LOOKUP (EKSTRA) ----------------

app.get("/api/partners/lookup", async (request, reply) => {
  try {
    const { query } = request.query || {};

    if (!query || typeof query !== "string") {
      return reply.code(400).send({
        error: "Mangler org-nummer",
        details:
          'Query-parameter "query" må være satt, f.eks. ?query=931815598',
      });
    }

    const trimmed = query.replace(/\s+/g, "");

    if (!/^\d{9}$/.test(trimmed)) {
      return reply.code(400).send({
        error: "Ugyldig org-nummer",
        details: "Org-nummer må være 9 sifre.",
      });
    }

    // Kall Enhetsregisteret (Brønnøysund)
    const brregRes = await fetch(
      `https://data.brreg.no/enhetsregisteret/api/enheter/${trimmed}`,
    );

    // 404 fra Brreg = fant ingen bedrift
    if (brregRes.status === 404) {
      return reply.send({ results: [] });
    }

    if (!brregRes.ok) {
      const bodyText = await brregRes.text().catch(() => null);

      request.log.error(
        {
          status: brregRes.status,
          body: bodyText,
        },
        "Feil ved Brreg lookup",
      );

      return reply.code(502).send({
        error: "Klarte ikke å hente info fra Enhetsregisteret",
        details: `Status ${brregRes.status}`,
      });
    }

    const data = await brregRes.json();

    const result = {
      orgNumber: data.organisasjonsnummer ?? trimmed,
      name: data.navn ?? null,
      addressLine:
        data.forretningsadresse &&
        Array.isArray(data.forretningsadresse.adresse)
          ? data.forretningsadresse.adresse.join(" ")
          : data.forretningsadresse?.adresse ?? null,
      postalCode: data.forretningsadresse?.postnummer ?? null,
      city: data.forretningsadresse?.poststed ?? null,
    };

    return reply.send({
      results: [result],
    });
  } catch (err) {
    request.log.error(err, "Uventet feil i /api/partners/lookup");

    return reply.code(500).send({
      error: "Uventet feil ved oppslag mot Enhetsregisteret",
      details: err?.message ?? String(err),
    });
  }
});

// ------------------------------------------------------------
// START SERVER
// ------------------------------------------------------------

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app
  .listen({ port, host: "0.0.0.0" })
  .then(() => {
    app.log.info({ port }, "LYXso API running");
  })
  .catch((err) => {
    app.log.error(err, "Feil ved oppstart av LYXso API");
    process.exit(1);
  });
