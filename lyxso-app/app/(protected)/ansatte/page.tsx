import type { Metadata } from "next";
import TeamManagementClient from "./TeamManagementClient";

export const metadata: Metadata = {
  title: "LYXso – Team & Tilgang",
  description:
    "Administrer team members, roller, invitasjoner og tilgangskontroll for din organisasjon.",
};

export default function AnsattePage() {
  return <TeamManagementClient />;
}
