import { Metadata } from 'next';
import RevenueForecastClient from './RevenueForecastClient';

export const metadata: Metadata = {
  title: 'Revenue Forecast - Rapporter | LYXso',
  description: 'Prediker fremtidig inntekt basert på historiske data',
};

export default function RevenueForecastPage() {
  return <RevenueForecastClient />;
}
