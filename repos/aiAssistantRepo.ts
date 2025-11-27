// repos/aiAssistantRepo.ts
// AI-lag for kundeinteraksjoner i LYXso CRM

// Dummy-lag som vi kobler til GPT-API senere
export async function sendAIAssistantMessage(message: string) {
  // Foreløpig bare logger vi – i neste versjon kobles OpenAI/LYXba
  console.log("[AI-assistent] melding sendt:", message);
  return {
    reply:
      "Hei! Dette er din LYXso AI-assistent. Jeg kan hjelpe deg med kundeservice, oppfølging og kampanjer.",
  };
}

// Typer for AI-oppsummering
export type CustomerAISummary = {
  summary: string;
  recommendations: string[];
  suggestedNextAction: string | null;
};

export type CustomerContext = {
  name: string;
  totalBookings: number;
  completedBookings: number;
  lastVisitDate: string | null;
  hasCoating: boolean;
  hasTireHotel: boolean;
  recentServices: string[];
};

/**
 * Genererer en AI-oppsummering av kunden basert på deres historikk
 * I denne første versjonen bruker vi lokale regler – senere kobles GPT-API
 */
export async function generateCustomerSummary(
  context: CustomerContext
): Promise<CustomerAISummary> {
  // Simulert forsinkelse for å vise loading-state
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { name, totalBookings, completedBookings, lastVisitDate, hasCoating, hasTireHotel, recentServices } = context;

  // Bygg opp oppsummering basert på kundedata
  const summaryParts: string[] = [];
  const recommendations: string[] = [];
  let suggestedNextAction: string | null = null;

  // Historikk-analyse
  if (totalBookings === 0) {
    summaryParts.push(`${name} er en ny kunde uten tidligere bookinger.`);
    recommendations.push("Send velkomst-SMS med tilbud på første behandling.");
    suggestedNextAction = "Opprett første booking for kunden.";
  } else {
    summaryParts.push(
      `${name} har ${totalBookings} booking${totalBookings === 1 ? "" : "er"} totalt, hvorav ${completedBookings} er fullført.`
    );
  }

  // Siste besøk-analyse
  if (lastVisitDate) {
    const lastVisit = new Date(lastVisitDate);
    const monthsSinceVisit = Math.floor(
      (Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    if (monthsSinceVisit > 12) {
      summaryParts.push(`Kunden har ikke vært innom på over ett år.`);
      recommendations.push("Re-aktiveringskampanje: Send tilbud for å få kunden tilbake.");
    } else if (monthsSinceVisit > 6) {
      summaryParts.push(`Det er over 6 måneder siden siste besøk.`);
      recommendations.push("Oppfølging: Send påminnelse om vedlikehold.");
    } else {
      summaryParts.push(`Siste besøk var for ${monthsSinceVisit} måned${monthsSinceVisit === 1 ? "" : "er"} siden.`);
    }
  }

  // Coating-analyse
  if (hasCoating) {
    summaryParts.push("Kunden har keramisk coating.");
    
    // Sjekk om det er på tide med årskontroll (simulert - i virkeligheten ville vi sjekke installasjonsdato)
    recommendations.push("Årskontroll coating: Sjekk tilstand og foreslå oppfølging.");
    
    if (lastVisitDate) {
      const lastVisit = new Date(lastVisitDate);
      const monthsSinceVisit = Math.floor(
        (Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      if (monthsSinceVisit >= 12) {
        suggestedNextAction = "Foreslå årskontroll av coating + innvendig rens.";
      }
    }
  }

  // Dekkhotell-analyse
  if (hasTireHotel) {
    summaryParts.push("Kunden benytter dekkhotell.");
    
    // Sjekk sesong for dekkskift
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 9 && currentMonth <= 11) {
      // Okt-Nov: tid for vinterdekk
      recommendations.push("Sesongvarsel: Tid for skifte til vinterdekk.");
      if (!suggestedNextAction) {
        suggestedNextAction = "Book dekkskift før vinteren.";
      }
    } else if (currentMonth >= 2 && currentMonth <= 4) {
      // Mars-April: tid for sommerdekk
      recommendations.push("Sesongvarsel: Tid for skifte til sommerdekk.");
      if (!suggestedNextAction) {
        suggestedNextAction = "Book dekkskift til sommerdekk.";
      }
    }
  }

  // Mersalg basert på tjenester
  if (recentServices.length > 0) {
    const servicesStr = recentServices.slice(0, 3).join(", ");
    summaryParts.push(`Nylige tjenester: ${servicesStr}.`);

    // Foreslå komplementære tjenester
    const hasPolishing = recentServices.some((s) => 
      s.toLowerCase().includes("polering") || s.toLowerCase().includes("polish")
    );
    const hasWash = recentServices.some((s) => 
      s.toLowerCase().includes("vask") || s.toLowerCase().includes("wash")
    );

    if (hasPolishing && !hasCoating) {
      recommendations.push("Mersalg: Kunden har hatt polering – foreslå keramisk coating for langvarig beskyttelse.");
    }
    if (hasWash && !hasPolishing) {
      recommendations.push("Mersalg: Etter vask kan polering gi enda bedre resultat.");
    }
  }

  // Fallback hvis ingen spesifikke anbefalinger
  if (recommendations.length === 0) {
    recommendations.push("Generelt: Følg opp med standard kundeservice.");
  }
  if (!suggestedNextAction) {
    suggestedNextAction = "Kontakt kunden for oppfølging.";
  }

  return {
    summary: summaryParts.join(" "),
    recommendations,
    suggestedNextAction,
  };
}

export type MessageSuggestion = {
  type: "sms" | "email";
  subject?: string;
  body: string;
};

/**
 * Genererer forslag til SMS/e-post basert på kundekontekst
 */
export async function generateMessageSuggestion(
  context: CustomerContext,
  messageType: "sms" | "email",
  purpose: "followup" | "reminder" | "offer" | "thankyou"
): Promise<MessageSuggestion> {
  // Simulert forsinkelse
  await new Promise((resolve) => setTimeout(resolve, 300));

  const { name, hasCoating, hasTireHotel, lastVisitDate } = context;
  const firstName = name.split(" ")[0];

  const templates: Record<string, Record<string, MessageSuggestion>> = {
    sms: {
      followup: {
        type: "sms",
        body: `Hei ${firstName}! Takk for sist. Hvordan går det med bilen? Vi har noen spennende tilbud akkurat nå. Hilsen teamet hos oss.`,
      },
      reminder: {
        type: "sms",
        body: `Hei ${firstName}! Det er en stund siden sist. Kanskje det er på tide med en sjekk${hasCoating ? " av coatingen" : ""}${hasTireHotel ? " eller dekkskift" : ""}? Book enkelt på lyxso.no. Hilsen oss.`,
      },
      offer: {
        type: "sms",
        body: `Hei ${firstName}! Som god kunde tilbyr vi deg 15% rabatt på neste behandling. Gyldig i 14 dager. Book på lyxso.no eller svar på denne meldingen.`,
      },
      thankyou: {
        type: "sms",
        body: `Hei ${firstName}! Tusen takk for besøket i dag. Vi håper du er fornøyd! Har du spørsmål, ta kontakt. God tur videre!`,
      },
    },
    email: {
      followup: {
        type: "email",
        subject: "Hvordan går det med bilen?",
        body: `Hei ${firstName},\n\nVi håper alt står bra til med deg og bilen din! Det er en stund siden sist, og vi tenkte vi skulle høre hvordan det går.\n\n${
          hasCoating
            ? "Coatingen din kan trenge en årskontroll for å holde seg i toppform. "
            : ""
        }${
          hasTireHotel
            ? "Husk at vi tar vare på dekkene dine – gi beskjed når det er tid for skifte. "
            : ""
        }\n\nTa gjerne kontakt om du har spørsmål eller ønsker å booke en time.\n\nMed vennlig hilsen,\nTeamet`,
      },
      reminder: {
        type: "email",
        subject: "På tide med service?",
        body: `Hei ${firstName},\n\nVi ser at det er en stund siden du var innom. ${
          lastVisitDate
            ? `Siste besøk var ${new Date(lastVisitDate).toLocaleDateString("no-NO")}.`
            : ""
        }\n\nRegelmessig vedlikehold er viktig for å holde bilen i topp stand. Book en time hos oss, så tar vi godt vare på den.\n\nBest regards,\nTeamet`,
      },
      offer: {
        type: "email",
        subject: "Eksklusivt tilbud til deg!",
        body: `Hei ${firstName},\n\nSom en verdifull kunde ønsker vi å gi deg et spesialtilbud: 15% rabatt på din neste behandling hos oss!\n\nTilbudet gjelder i 14 dager fra i dag.\n\nBook enkelt på vår nettside eller svar på denne e-posten.\n\nVi gleder oss til å se deg!\n\nMed vennlig hilsen,\nTeamet`,
      },
      thankyou: {
        type: "email",
        subject: "Takk for besøket!",
        body: `Hei ${firstName},\n\nTusen takk for at du valgte oss i dag! Vi håper du er fornøyd med resultatet.\n\nHar du tilbakemeldinger eller spørsmål, ikke nøl med å ta kontakt. Vi setter stor pris på din tillit.\n\nGod tur videre!\n\nMed vennlig hilsen,\nTeamet`,
      },
    },
  };

  return templates[messageType][purpose] || templates.sms.followup;
}
