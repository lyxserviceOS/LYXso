import { Metadata } from 'next'
import ModulesControlClient from './ModulesControlClient'

export const metadata: Metadata = {
  title: 'Moduler | LYXso',
  description: 'Kontroller hvilke moduler som er aktivert for din bedrift'
}

export default function ModulesPage() {
  return <ModulesControlClient />
}
