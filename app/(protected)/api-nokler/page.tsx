import ApiKeysPageClient from "./ApiKeysPageClient";

export const metadata = {
  title: "API-nøkler | LYXso",
  description: "Administrer API-nøkler for tredjepartstjenester",
};

export default function ApiKeysPage() {
  return <ApiKeysPageClient />;
}
