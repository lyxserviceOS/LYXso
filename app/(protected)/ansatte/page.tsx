import type { Metadata } from "next";
import AnsattePageClient from "./AnsattePageClient";

export const metadata: Metadata = {
  title: "LYXso – ./Ansatte",
  description:
    "Administrer ansatte, kontaktinformasjon og roller for LYXso-partneren.",
};

export default function AnsattePage() {
  return <AnsattePageClient />;
}
