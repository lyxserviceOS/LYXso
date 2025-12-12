import { Metadata } from 'next';
import { AIHubClient } from './AIHubClient';

export const metadata: Metadata = {
  title: 'AI Hub | LYXso',
  description: 'Oversikt over alle AI-moduler og intelligent automatisering',
};

export default function AIHubPage() {
  return <AIHubClient />;
}
