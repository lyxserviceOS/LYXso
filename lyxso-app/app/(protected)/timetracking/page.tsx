import { Metadata } from 'next'
import TimeTrackingClient from './TimeTrackingClient'

export const metadata: Metadata = {
  title: 'Tidsstyring | LYXso',
  description: 'Stemple inn/ut med WiFi-verifisering og arbeidslogg'
}

export default function TimeTrackingPage() {
  return <TimeTrackingClient />
}
