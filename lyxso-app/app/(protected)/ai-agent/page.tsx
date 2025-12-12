// app/(protected)/ai-agent/page.tsx
import { Metadata } from 'next';
import LYXbaControlPanelClient from "./LYXbaControlPanelClient";

export const metadata: Metadata = {
  title: 'LYXba Control Panel | LYXso',
  description: 'Administrer din AI booking agent',
};

export default function AIAgentPage() {
  return <LYXbaControlPanelClient />;
}
