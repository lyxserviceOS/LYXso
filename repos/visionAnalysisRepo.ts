// repos/visionAnalysisRepo.ts
// Image and text analysis functionality for LYX Vision

import type { ImageTag, InspectionType, VehicleSection } from "@/types/vision";

/**
 * Result of AI image analysis
 */
export type ImageAnalysisResult = {
  /** Unique analysis ID */
  id: string;
  /** URL of the analyzed image */
  imageUrl: string;
  /** Detected tags/issues in the image */
  tags: ImageTag[];
  /** AI confidence score (0-100) */
  confidence: number;
  /** Human-readable analysis description */
  analysis: string;
  /** Detected vehicle section if applicable */
  vehicleSection: VehicleSection | null;
  /** Detected severity of issues */
  severity: "minor" | "moderate" | "severe" | null;
  /** Recommended actions based on analysis */
  recommendations: string[];
  /** Timestamp of analysis */
  analyzedAt: string;
};

/**
 * Result of text message analysis
 */
export type TextAnalysisResult = {
  /** Unique analysis ID */
  id: string;
  /** Original text that was analyzed */
  originalText: string;
  /** Detected intent of the message */
  intent: "booking" | "inquiry" | "complaint" | "feedback" | "support" | "general";
  /** Detected service interest if any */
  serviceInterest: string | null;
  /** Detected urgency level */
  urgency: "low" | "medium" | "high";
  /** Detected sentiment */
  sentiment: "positive" | "neutral" | "negative";
  /** Key entities extracted from text */
  entities: {
    type: "date" | "time" | "vehicle" | "service" | "location" | "name" | "phone" | "email";
    value: string;
    confidence: number;
  }[];
  /** Suggested response */
  suggestedResponse: string | null;
  /** Timestamp of analysis */
  analyzedAt: string;
};

/**
 * Combined analysis result for messages with both images and text
 */
export type MessageAnalysisResult = {
  /** Unique analysis ID */
  id: string;
  /** Organization ID */
  orgId: string;
  /** Customer ID if known */
  customerId: string | null;
  /** Conversation ID if part of a conversation */
  conversationId: string | null;
  /** Text analysis result */
  textAnalysis: TextAnalysisResult | null;
  /** Image analysis results (can be multiple images) */
  imageAnalyses: ImageAnalysisResult[];
  /** Combined summary */
  summary: string;
  /** Overall recommended action */
  recommendedAction: string;
  /** Timestamp */
  createdAt: string;
};

/**
 * Generates a unique ID for analysis results
 */
function generateAnalysisId(): string {
  return `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Simulates AI delay for realistic response times
 */
async function simulateAIDelay(minMs: number = 300, maxMs: number = 800): Promise<void> {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Analyzes an image for vehicle condition, coating status, and defects
 * In production, this would connect to an AI service like OpenAI Vision API
 */
export async function analyzeImage(
  imageUrl: string,
  inspectionType: InspectionType = "general"
): Promise<ImageAnalysisResult> {
  await simulateAIDelay();

  // Simulated AI analysis - in production, this would call an AI vision API
  const possibleTags: ImageTag[] = [
    "scratch",
    "swirl",
    "dent",
    "chip",
    "oxidation",
    "water_spot",
    "contamination",
    "clean",
    "coated",
    "polished",
  ];

  // Simulate detecting 1-3 random tags
  const numTags = Math.floor(Math.random() * 3) + 1;
  const detectedTags: ImageTag[] = [];
  for (let i = 0; i < numTags; i++) {
    const randomTag = possibleTags[Math.floor(Math.random() * possibleTags.length)];
    if (!detectedTags.includes(randomTag)) {
      detectedTags.push(randomTag);
    }
  }

  // Determine severity based on detected issues
  const issueTagList: ImageTag[] = ["scratch", "swirl", "dent", "chip", "oxidation", "water_spot", "contamination"];
  const hasIssues = detectedTags.some((tag) => issueTagList.includes(tag));
  const severity = hasIssues
    ? detectedTags.includes("dent") || detectedTags.includes("chip")
      ? "severe"
      : detectedTags.includes("scratch") || detectedTags.includes("oxidation")
        ? "moderate"
        : "minor"
    : null;

  // Generate analysis description
  const analysisDescriptions: Record<string, string> = {
    scratch: "Riper observert på overflaten. Kan fjernes med polering.",
    swirl: "Svirlmerker synlige. Indikerer tidligere feil vasketeknikk.",
    dent: "Bulk i karosseriet. Krever PDR eller tradisjonell bulkreparasjon.",
    chip: "Steinsprut observert. Bør behandles for å forhindre rust.",
    oxidation: "Oksidering på lakken. Anbefaler polering og beskyttelse.",
    water_spot: "Vannflekker synlige. Kan fjernes med spesialmiddel.",
    contamination: "Forurensning på overflaten. Anbefaler dekontaminering.",
    clean: "Overflaten er ren og klar for videre behandling.",
    coated: "Coating-lag er synlig og intakt.",
    polished: "Lakken fremstår polert og har god glans.",
  };

  const analysisText = detectedTags
    .map((tag) => analysisDescriptions[tag] || `Oppdaget: ${tag}`)
    .join(" ");

  // Generate recommendations
  const recommendations: string[] = [];
  if (detectedTags.includes("scratch") || detectedTags.includes("swirl")) {
    recommendations.push("1-2 trinns polering anbefales for å fjerne overflateskader");
  }
  if (detectedTags.includes("oxidation")) {
    recommendations.push("Dekontaminering etterfulgt av polering for å gjenopprette lakken");
  }
  if (detectedTags.includes("dent") || detectedTags.includes("chip")) {
    recommendations.push("Vurder PDR eller lakkering før coating-behandling");
  }
  if (detectedTags.includes("water_spot") || detectedTags.includes("contamination")) {
    recommendations.push("Dekontaminering med clay bar eller kjemisk rens");
  }
  if (!hasIssues) {
    recommendations.push("Overflaten er i god stand - klar for coating eller vedlikehold");
  }

  // Simulate detecting vehicle section based on inspection type
  const vehicleSection: VehicleSection | null =
    inspectionType === "pre_coating" || inspectionType === "post_coating"
      ? (["hood", "roof", "trunk", "front_bumper", "rear_bumper"][
          Math.floor(Math.random() * 5)
        ] as VehicleSection)
      : null;

  return {
    id: generateAnalysisId(),
    imageUrl,
    tags: detectedTags,
    confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confidence
    analysis: analysisText,
    vehicleSection,
    severity,
    recommendations,
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Analyzes text content from a customer message
 * In production, this would use NLP/AI to extract intent and entities
 */
export async function analyzeText(text: string): Promise<TextAnalysisResult> {
  await simulateAIDelay(200, 500);

  const lowerText = text.toLowerCase();

  // Detect intent based on keywords
  let intent: TextAnalysisResult["intent"] = "general";
  if (
    lowerText.includes("bestill") ||
    lowerText.includes("book") ||
    lowerText.includes("time") ||
    lowerText.includes("ledig")
  ) {
    intent = "booking";
  } else if (
    lowerText.includes("pris") ||
    lowerText.includes("kost") ||
    lowerText.includes("hvor mye") ||
    lowerText.includes("hva koster")
  ) {
    intent = "inquiry";
  } else if (
    lowerText.includes("klage") ||
    lowerText.includes("misfornøyd") ||
    lowerText.includes("problem") ||
    lowerText.includes("feil")
  ) {
    intent = "complaint";
  } else if (
    lowerText.includes("hjelp") ||
    lowerText.includes("spørsmål") ||
    lowerText.includes("hvordan")
  ) {
    intent = "support";
  } else if (
    lowerText.includes("bra") ||
    lowerText.includes("fornøyd") ||
    lowerText.includes("takk") ||
    lowerText.includes("flott")
  ) {
    intent = "feedback";
  }

  // Detect service interest
  let serviceInterest: string | null = null;
  if (lowerText.includes("coating") || lowerText.includes("keramisk")) {
    serviceInterest = "Keramisk coating";
  } else if (lowerText.includes("polering") || lowerText.includes("polish")) {
    serviceInterest = "Polering";
  } else if (lowerText.includes("vask") || lowerText.includes("rengjøring")) {
    serviceInterest = "Bilvask";
  } else if (lowerText.includes("dekk") || lowerText.includes("hjul")) {
    serviceInterest = "Dekkhotell / Dekkskift";
  } else if (lowerText.includes("folie") || lowerText.includes("ppf")) {
    serviceInterest = "Lakkbeskyttelsesfolie (PPF)";
  }

  // Detect urgency
  let urgency: TextAnalysisResult["urgency"] = "low";
  if (
    lowerText.includes("haster") ||
    lowerText.includes("raskt") ||
    lowerText.includes("snart") ||
    lowerText.includes("i dag") ||
    lowerText.includes("nå")
  ) {
    urgency = "high";
  } else if (
    lowerText.includes("neste uke") ||
    lowerText.includes("snart") ||
    lowerText.includes("denne uken")
  ) {
    urgency = "medium";
  }

  // Detect sentiment
  let sentiment: TextAnalysisResult["sentiment"] = "neutral";
  const positiveWords = ["bra", "flott", "fornøyd", "takk", "perfekt", "topp", "fantastisk"];
  const negativeWords = ["dårlig", "misfornøyd", "skuffet", "problem", "feil", "klage", "sint"];

  if (positiveWords.some((word) => lowerText.includes(word))) {
    sentiment = "positive";
  } else if (negativeWords.some((word) => lowerText.includes(word))) {
    sentiment = "negative";
  }

  // Extract entities
  const entities: TextAnalysisResult["entities"] = [];

  // Simple phone number detection
  const phoneMatch = text.match(/(\+47\s?)?(\d{2}\s?\d{2}\s?\d{2}\s?\d{2})/);
  if (phoneMatch) {
    entities.push({ type: "phone", value: phoneMatch[0], confidence: 95 });
  }

  // Simple email detection
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    entities.push({ type: "email", value: emailMatch[0], confidence: 98 });
  }

  // Date/time detection (simple patterns)
  const datePatterns = [
    /(\d{1,2})[./-](\d{1,2})[./-]?(\d{2,4})?/,
    /(mandag|tirsdag|onsdag|torsdag|fredag|lørdag|søndag)/i,
    /(i dag|i morgen|neste uke)/i,
  ];
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      entities.push({ type: "date", value: match[0], confidence: 75 });
      break;
    }
  }

  const timeMatch = text.match(/kl\.?\s?(\d{1,2})[:.:]?(\d{2})?/);
  if (timeMatch) {
    entities.push({ type: "time", value: timeMatch[0], confidence: 90 });
  }

  // Vehicle detection
  const vehiclePatterns = [
    /(tesla|bmw|audi|mercedes|volkswagen|volvo|toyota|ford|porsche)/i,
    /[a-z]{2}\s?\d{5}/i, // Norwegian license plate pattern
  ];
  for (const pattern of vehiclePatterns) {
    const match = text.match(pattern);
    if (match) {
      entities.push({ type: "vehicle", value: match[0], confidence: 85 });
    }
  }

  // Generate suggested response based on intent
  const suggestedResponses: Record<string, string> = {
    booking: `Takk for din henvendelse! Vi har ledige timer for ${serviceInterest || "våre tjenester"}. Når passer det for deg?`,
    inquiry: `Vi svarer gjerne på spørsmål om ${serviceInterest || "våre tjenester"}. Hva lurer du på?`,
    complaint:
      "Vi beklager at du har opplevd problemer. Vi tar dette på alvor og vil løse dette for deg. Kan du fortelle mer om hva som skjedde?",
    support: "Selvfølgelig, vi hjelper deg gjerne! Hva trenger du hjelp med?",
    feedback: "Tusen takk for tilbakemeldingen! Det setter vi stor pris på.",
    general: "Takk for meldingen. Hvordan kan vi hjelpe deg i dag?",
  };

  return {
    id: generateAnalysisId(),
    originalText: text,
    intent,
    serviceInterest,
    urgency,
    sentiment,
    entities,
    suggestedResponse: suggestedResponses[intent],
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Analyzes a complete message with both text and images
 */
export async function analyzeMessage(
  orgId: string,
  text: string | null,
  imageUrls: string[],
  customerId?: string,
  conversationId?: string
): Promise<MessageAnalysisResult> {
  // Run text and image analyses in parallel
  const [textAnalysis, imageAnalyses] = await Promise.all([
    text ? analyzeText(text) : Promise.resolve(null),
    Promise.all(imageUrls.map((url) => analyzeImage(url))),
  ]);

  // Generate combined summary
  const summaryParts: string[] = [];

  if (textAnalysis) {
    summaryParts.push(
      `Melding analysert: ${textAnalysis.intent === "booking" ? "Ønsker å bestille time" : textAnalysis.intent === "inquiry" ? "Har spørsmål" : textAnalysis.intent === "complaint" ? "Klage/problem" : textAnalysis.intent === "feedback" ? "Tilbakemelding" : textAnalysis.intent === "support" ? "Trenger hjelp" : "Generell henvendelse"}.`
    );
    if (textAnalysis.serviceInterest) {
      summaryParts.push(`Interessert i: ${textAnalysis.serviceInterest}.`);
    }
    if (textAnalysis.urgency !== "low") {
      summaryParts.push(
        `Haster: ${textAnalysis.urgency === "high" ? "Ja, trenger raskt svar" : "Moderat"}.`
      );
    }
  }

  if (imageAnalyses.length > 0) {
    const allTags = [...new Set(imageAnalyses.flatMap((a) => a.tags))];
    const hasIssues = allTags.some((tag) =>
      ["scratch", "swirl", "dent", "chip", "oxidation", "water_spot", "contamination"].includes(tag)
    );

    summaryParts.push(
      `${imageAnalyses.length} bilde${imageAnalyses.length > 1 ? "r" : ""} analysert: ${hasIssues ? "Fant defekter/skader som bør behandles" : "Overflaten er i god stand"}.`
    );
  }

  // Determine recommended action
  let recommendedAction = "Følg opp med standard kundeservice.";

  if (textAnalysis?.intent === "booking") {
    recommendedAction = "Tilby ledige timer og bekreft booking.";
  } else if (textAnalysis?.intent === "complaint") {
    recommendedAction = "Prioriter denne henvendelsen - overfør til ansvarlig om nødvendig.";
  } else if (imageAnalyses.some((a) => a.severity === "severe")) {
    recommendedAction = "Alvorlige skader oppdaget - anbefal befaring eller profesjonell vurdering.";
  } else if (imageAnalyses.some((a) => a.severity === "moderate")) {
    recommendedAction =
      "Moderate skader funnet - gi tilbud på polering/reparasjon.";
  }

  return {
    id: generateAnalysisId(),
    orgId,
    customerId: customerId || null,
    conversationId: conversationId || null,
    textAnalysis,
    imageAnalyses,
    summary: summaryParts.join(" "),
    recommendedAction,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generates a paint condition score (1-10) based on image analysis
 */
export function calculatePaintConditionScore(analyses: ImageAnalysisResult[]): {
  score: number;
  description: string;
} {
  if (analyses.length === 0) {
    return { score: 0, description: "Ingen bilder analysert" };
  }

  const severityScores = analyses.map((a) => {
    switch (a.severity) {
      case "severe":
        return 3;
      case "moderate":
        return 6;
      case "minor":
        return 8;
      default:
        return 10;
    }
  });

  const avgScore = Math.round(severityScores.reduce((a, b) => a + b, 0) / severityScores.length);

  const descriptions: Record<number, string> = {
    10: "Utmerket tilstand - lakken er som ny",
    9: "Meget bra - minimale tegn til slitasje",
    8: "Bra - lett slitasje, ingen vesentlige skader",
    7: "God - noen synlige merker",
    6: "Akseptabel - moderate skader som bør behandles",
    5: "Under middels - anbefaler polering",
    4: "Svak - tydelige skader, trenger behandling",
    3: "Dårlig - betydelige skader",
    2: "Meget dårlig - omfattende skader",
    1: "Kritisk - krever full restaurering",
  };

  return {
    score: avgScore,
    description: descriptions[avgScore] || "Tilstand ukjent",
  };
}

/**
 * Estimates work hours needed based on analysis
 */
export function estimateWorkHours(analyses: ImageAnalysisResult[]): {
  minHours: number;
  maxHours: number;
  breakdown: { task: string; hours: number }[];
} {
  if (analyses.length === 0) {
    return { minHours: 0, maxHours: 0, breakdown: [] };
  }

  const breakdown: { task: string; hours: number }[] = [];
  const allTags = [...new Set(analyses.flatMap((a) => a.tags))];

  // Base time estimates per issue type
  if (allTags.includes("contamination") || allTags.includes("water_spot")) {
    breakdown.push({ task: "Dekontaminering", hours: 1 });
  }

  if (allTags.includes("swirl") || allTags.includes("scratch")) {
    const hasSevere = analyses.some(
      (a) => a.tags.includes("scratch") && a.severity === "severe"
    );
    breakdown.push({
      task: hasSevere ? "3-trinns polering" : "2-trinns polering",
      hours: hasSevere ? 4 : 2.5,
    });
  }

  if (allTags.includes("oxidation")) {
    breakdown.push({ task: "Oksideringsbehandling", hours: 1.5 });
  }

  // If clean and no issues, just inspection time
  if (breakdown.length === 0) {
    breakdown.push({ task: "Inspeksjon og klargjøring", hours: 0.5 });
  }

  const totalHours = breakdown.reduce((sum, item) => sum + item.hours, 0);

  return {
    minHours: Math.round(totalHours * 0.8 * 10) / 10,
    maxHours: Math.round(totalHours * 1.2 * 10) / 10,
    breakdown,
  };
}
