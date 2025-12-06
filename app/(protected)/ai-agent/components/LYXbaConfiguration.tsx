'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Clock, 
  MessageSquare, 
  Phone, 
  Mail, 
  Globe,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function LYXbaConfiguration() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [greetingMessage, setGreetingMessage] = useState(
    'Hei! Jeg er LYXba, din personlige bookingassistent. Hvordan kan jeg hjelpe deg i dag?'
  );
  const [tone, setTone] = useState('friendly');
  const [maxContactAttempts, setMaxContactAttempts] = useState('3');
  const [enabledChannels, setEnabledChannels] = useState({
    sms: true,
    email: true,
    chat: true,
    phone: false,
    landing_page: true,
  });
  const [operatingHours, setOperatingHours] = useState({
    monday: { start: '08:00', end: '18:00', enabled: true },
    tuesday: { start: '08:00', end: '18:00', enabled: true },
    wednesday: { start: '08:00', end: '18:00', enabled: true },
    thursday: { start: '08:00', end: '18:00', enabled: true },
    friday: { start: '08:00', end: '17:00', enabled: true },
    saturday: { start: '10:00', end: '14:00', enabled: false },
    sunday: { start: '10:00', end: '14:00', enabled: false },
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Replace with real API call
    console.log('Saving configuration...', {
      isEnabled,
      greetingMessage,
      tone,
      maxContactAttempts,
      enabledChannels,
      operatingHours,
    });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const dayLabels: Record<string, string> = {
    monday: 'Mandag',
    tuesday: 'Tirsdag',
    wednesday: 'Onsdag',
    thursday: 'Torsdag',
    friday: 'Fredag',
    saturday: 'Lørdag',
    sunday: 'Søndag',
  };

  return (
    <div className="space-y-6">
      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Status
            </span>
            <Badge variant={isEnabled ? "default" : "secondary"} className={isEnabled ? 'bg-green-600' : 'bg-gray-400'}>
              {isEnabled ? 'Aktiv' : 'Inaktiv'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Aktiver eller deaktiver LYXba booking agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <Label htmlFor="agent-enabled" className="text-base font-medium">
                LYXba Agent
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                {isEnabled 
                  ? 'AI-agenten svarer automatisk på alle henvendelser' 
                  : 'AI-agenten er deaktivert og svarer ikke på henvendelser'}
              </p>
            </div>
            <Switch
              id="agent-enabled"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Grunnleggende innstillinger
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="greeting">Hilsningstekst</Label>
            <Textarea
              id="greeting"
              value={greetingMessage}
              onChange={(e) => setGreetingMessage(e.target.value)}
              rows={3}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Dette er første melding kunden får når de starter en samtale
            </p>
          </div>

          <div>
            <Label htmlFor="tone">Tone of voice</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Vennlig og avslappet</SelectItem>
                <SelectItem value="professional">Profesjonell og formell</SelectItem>
                <SelectItem value="enthusiastic">Entusiastisk og energisk</SelectItem>
                <SelectItem value="concise">Kort og konsis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="max-attempts">Maks kontaktforsøk</Label>
            <Input
              id="max-attempts"
              type="number"
              value={maxContactAttempts}
              onChange={(e) => setMaxContactAttempts(e.target.value)}
              min="1"
              max="10"
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Hvor mange ganger AI skal forsøke å kontakte en lead før den gir opp
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Aktive kanaler</CardTitle>
          <CardDescription>
            Velg hvilke kanaler LYXba skal være aktiv på
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { key: 'sms', label: 'SMS', icon: Phone },
              { key: 'email', label: 'E-post', icon: Mail },
              { key: 'chat', label: 'Live chat', icon: MessageSquare },
              { key: 'phone', label: 'Telefon', icon: Phone },
              { key: 'landing_page', label: 'Landingsside', icon: Globe },
            ].map((channel) => (
              <div key={channel.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <channel.icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{channel.label}</span>
                </div>
                <Switch
                  checked={enabledChannels[channel.key as keyof typeof enabledChannels]}
                  onCheckedChange={(checked) => 
                    setEnabledChannels(prev => ({ ...prev, [channel.key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Åpningstider
          </CardTitle>
          <CardDescription>
            Når LYXba skal være aktiv og svare på henvendelser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(operatingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <Switch
                  checked={hours.enabled}
                  onCheckedChange={(checked) =>
                    setOperatingHours(prev => ({
                      ...prev,
                      [day]: { ...prev[day as keyof typeof prev], enabled: checked },
                    }))
                  }
                />
                <span className="font-medium w-24">{dayLabels[day]}</span>
                {hours.enabled ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={hours.start}
                      onChange={(e) =>
                        setOperatingHours(prev => ({
                          ...prev,
                          [day]: { ...prev[day as keyof typeof prev], start: e.target.value },
                        }))
                      }
                      className="w-32"
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="time"
                      value={hours.end}
                      onChange={(e) =>
                        setOperatingHours(prev => ({
                          ...prev,
                          [day]: { ...prev[day as keyof typeof prev], end: e.target.value },
                        }))
                      }
                      className="w-32"
                    />
                  </div>
                ) : (
                  <span className="text-gray-400">Stengt</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        {saved && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Innstillinger lagret!</span>
          </div>
        )}
        <Button onClick={handleSave} size="lg" className="bg-purple-600 hover:bg-purple-700">
          <Save className="w-4 h-4 mr-2" />
          Lagre innstillinger
        </Button>
      </div>
    </div>
  );
}
