import { Metadata } from 'next';
import CLVAnalysisClient from './CLVAnalysisClient';

export const metadata: Metadata = {
  title: 'Customer Lifetime Value - Rapporter | LYXso',
  description: 'Analyser customer lifetime value og kundesegmentering',
};

export default function CLVAnalysisPage() {
  return <CLVAnalysisClient />;
}
