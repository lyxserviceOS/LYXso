// lib/constants/industries.ts
// Industry definitions and service templates

export const INDUSTRIES = [
  { value: "bilpleie", label: "Bilpleie" },
  { value: "dekkhotell", label: "Dekkhotell" },
  { value: "bilverksted", label: "Bilverksted" },
  { value: "bruktbil", label: "Bruktbil" },
  { value: "ppf", label: "PPF (Paint Protection Film)" },
  { value: "coating", label: "Keramisk coating" },
  { value: "detailing", label: "Detailing" },
  { value: "bilpleie_mobile", label: "Mobil bilpleie" },
] as const;

export const SERVICES_BY_INDUSTRY: Record<string, string[]> = {
  bilpleie: [
    "Utvendig vask",
    "Innvendig vask",
    "Fullshine",
    "Polering",
    "Voksing",
    "Motor vask",
  ],
  dekkhotell: [
    "Dekkhotell oppbevaring",
    "Dekkskift",
    "Hjulskift",
    "Balansering",
    "Dekkreparasjon",
  ],
  bilverksted: [
    "Service",
    "EU-kontroll",
    "Reparasjoner",
    "Diagnostikk",
    "Bremseskift",
    "Oljeskift",
  ],
  bruktbil: [
    "Bilsalg",
    "Innbytte",
    "Finansiering",
    "Garanti",
    "Tilstandsrapport",
  ],
  ppf: [
    "Hel bil PPF",
    "Frontpakke PPF",
    "Panser PPF",
    "Speil PPF",
    "Dører PPF",
  ],
  coating: [
    "Keramisk coating hel bil",
    "Coating frontrute",
    "Coating felger",
    "Coating plast",
  ],
  detailing: [
    "Full detailing",
    "Eksteriør detailing",
    "Interiør detailing",
    "Motor detailing",
    "Polering 1-trinns",
    "Polering 2-trinns",
  ],
  bilpleie_mobile: [
    "Mobil vask",
    "Mobil polering",
    "Mobil interiør rens",
  ],
};

export const PRICE_LEVELS = [
  {
    value: "budget" as const,
    label: "Budsjett",
    description: "Konkurransedyktige priser, fokus på volum",
  },
  {
    value: "normal" as const,
    label: "Normal",
    description: "Midt på treet, god balanse mellom pris og kvalitet",
  },
  {
    value: "premium" as const,
    label: "Premium",
    description: "Premium-priser, fokus på kvalitet og service",
  },
] as const;

export const WEEKDAYS = [
  { key: "monday", label: "Mandag" },
  { key: "tuesday", label: "Tirsdag" },
  { key: "wednesday", label: "Onsdag" },
  { key: "thursday", label: "Torsdag" },
  { key: "friday", label: "Fredag" },
  { key: "saturday", label: "Lørdag" },
  { key: "sunday", label: "Søndag" },
] as const;
