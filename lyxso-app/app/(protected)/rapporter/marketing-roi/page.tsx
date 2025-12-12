import { Metadata } from 'next';
import MarketingROIClient from './MarketingROIClient';

export const metadata: Metadata = {
  title: 'Marketing ROI - Rapporter | LYXso',
  description: 'Analyser marketing ROI, ROAS og kampanjeeffektivitet',
};

export default function MarketingROIPage() {
  return <MarketingROIClient />;
}
