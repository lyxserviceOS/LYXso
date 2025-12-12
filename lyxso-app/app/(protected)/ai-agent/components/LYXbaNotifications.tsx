'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Phone,
  CheckCircle,
  Save,
  Smartphone
} from 'lucide-react';

export function LYXbaNotifications() {
  const [notifications, setNotifications] = useState({
    newConversation: {
      email: true,
      sms: false,
      inApp: true,
      push: false,
    },
    bookingCreated: {
      email: true,
      sms: true,
      inApp: true,
      push: true,
    },
    handoff: {
      email: true,
      sms: true,
      inApp: true,
      push: true,
    },
    noResponse: {
      email: false,
      sms: false,
      inApp: true,
      push: false,
    },
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    console.log('Saving notification settings...', notifications);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const events = [
    {
      key: 'newConversation',
      title: 'Ny samtale startet',
      description: 'Når en kunde starter en samtale med LYXba',
      icon: MessageSquare,
      color: 'text-blue-600',
    },
    {
      key: 'bookingCreated',
      title: 'Booking opprettet',
      description: 'Når LYXba har opprettet en booking',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      key: 'handoff',
      title: 'Overført til menneske',
      description: 'Når kunden ber om å snakke med en person',
      icon: Phone,
      color: 'text-amber-600',
    },
    {
      key: 'noResponse',
      title: 'Ingen respons',
      description: 'Når en kunde ikke svarer etter flere forsøk',
      icon: Bell,
      color: 'text-red-600',
    },
  ];

  const channels = [
    { key: 'email', label: 'E-post', icon: Mail },
    { key: 'sms', label: 'SMS', icon: MessageSquare },
    { key: 'inApp', label: 'I appen', icon: Bell },
    { key: 'push', label: 'Push', icon: Smartphone },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Varslingsinnstillinger</CardTitle>
          <CardDescription>
            Velg hvordan du vil bli varslet om hendelser fra LYXba
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.key} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2 bg-gray-100 rounded-lg ${event.color}`}>
                    <event.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ml-14">
                  {channels.map((channel) => (
                    <div key={channel.key} className="flex items-center gap-2">
                      <Switch
                        checked={notifications[event.key as keyof typeof notifications][channel.key as keyof typeof notifications.newConversation]}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({
                            ...prev,
                            [event.key]: {
                              ...prev[event.key as keyof typeof prev],
                              [channel.key]: checked,
                            },
                          }))
                        }
                      />
                      <Label className="text-sm flex items-center gap-1.5">
                        <channel.icon className="w-4 h-4 text-gray-500" />
                        {channel.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Hurtiginnstillinger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const allOn = {
                  email: true,
                  sms: true,
                  inApp: true,
                  push: true,
                };
                setNotifications({
                  newConversation: allOn,
                  bookingCreated: allOn,
                  handoff: allOn,
                  noResponse: allOn,
                });
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Aktiver alle varsler
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const allOff = {
                  email: false,
                  sms: false,
                  inApp: false,
                  push: false,
                };
                setNotifications({
                  newConversation: allOff,
                  bookingCreated: allOff,
                  handoff: allOff,
                  noResponse: allOff,
                });
              }}
            >
              <Bell className="w-4 h-4 mr-2 text-gray-600" />
              Deaktiver alle varsler
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const critical = {
                  email: true,
                  sms: true,
                  inApp: true,
                  push: true,
                };
                const normal = {
                  email: false,
                  sms: false,
                  inApp: true,
                  push: false,
                };
                setNotifications({
                  newConversation: normal,
                  bookingCreated: critical,
                  handoff: critical,
                  noResponse: normal,
                });
              }}
            >
              <Bell className="w-4 h-4 mr-2 text-amber-600" />
              Kun kritiske varsler
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        {saved && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Varsler lagret!</span>
          </div>
        )}
        <Button onClick={handleSave} size="lg" className="bg-purple-600 hover:bg-purple-700">
          <Save className="w-4 h-4 mr-2" />
          Lagre varsler
        </Button>
      </div>
    </div>
  );
}
