/**
 * TIME TRACKING - Check In/Out Component
 * Employee view for checking in and out of work
 */
'use client';

import { useState, useEffect } from 'react';
import { Clock, MapPin, Wifi, CheckCircle, XCircle, Coffee } from 'lucide-react';
import { showToast } from '@/lib/toast';

interface CheckinStatus {
  checked_in: boolean;
  checkin?: any;
  current_work_time?: {
    hours: number;
    minutes: number;
    formatted: string;
  };
  breaks?: any[];
}

export default function TimeTrackingCheckIn() {
  const [status, setStatus] = useState<CheckinStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [wifi, setWifi] = useState<{ ssid: string; mac: string } | null>(null);

  useEffect(() => {
    loadStatus();
    getLocation();
    const interval = setInterval(loadStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      const res = await fetch('/api/time-tracking/status');
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Location error:', error)
      );
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/time-tracking/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: location?.lat,
          longitude: location?.lng,
          wifi_ssid: wifi?.ssid,
          wifi_mac: wifi?.mac,
          ip_address: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => d.ip).catch(() => null)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast.error(data.error || 'Kunne ikke stemple inn', {
          description: data.details ? 'Sjekk WiFi eller GPS' : undefined
        });
        return;
      }

      showToast.success('Innstemplet!', {
        description: `Validert via ${data.validation.method}`
      });

      await loadStatus();
    } catch (error) {
      showToast.error('Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!status?.checkin?.id) return;

    setLoading(true);
    try {
      const res = await fetch('/api/time-tracking/check-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkin_id: status.checkin.id,
          latitude: location?.lat,
          longitude: location?.lng
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast.error(data.error || 'Kunne ikke stemple ut');
        return;
      }

      showToast.success(data.message, {
        description: `${data.summary.work_hours} timer jobbet`
      });

      await loadStatus();
    } catch (error) {
      showToast.error('Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  const handleBreak = async (action: 'start' | 'end') => {
    if (!status?.checkin?.id) return;

    setLoading(true);
    try {
      const activeBreak = status.breaks?.find(b => !b.break_end);

      const res = await fetch('/api/time-tracking/breaks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          checkin_id: status.checkin.id,
          break_id: activeBreak?.id,
          break_type: 'lunch'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast.error(data.error || 'Kunne ikke håndtere pause');
        return;
      }

      showToast.success(data.message);
      await loadStatus();
    } catch (error) {
      showToast.error('Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  const activeBreak = status?.breaks?.find(b => !b.break_end);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tidsregistrering</h1>
          <p className="text-slate-600">
            {new Date().toLocaleDateString('no-NO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Status Card */}
        {status?.checked_in ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-bold text-green-900">Innstemplet</h2>
                  <p className="text-green-700">
                    Kl {new Date(status.checkin.check_in_time).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-900">
                  {status.current_work_time?.formatted || '0t 0min'}
                </div>
                <p className="text-sm text-green-700">arbeidstid</p>
              </div>
            </div>

            {/* Validation Info */}
            <div className="flex gap-4 text-sm">
              {status.checkin.wifi_validated && (
                <div className="flex items-center gap-2 text-green-700">
                  <Wifi className="w-4 h-4" />
                  <span>WiFi validert</span>
                </div>
              )}
              {status.checkin.location_validated && (
                <div className="flex items-center gap-2 text-green-700">
                  <MapPin className="w-4 h-4" />
                  <span>Lokasjon validert</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-slate-400" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">Ikke innstemplet</h2>
                <p className="text-slate-600">Trykk på "Stemple inn" for å starte arbeidsdagen</p>
              </div>
            </div>
          </div>
        )}

        {/* Location Status */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className={`w-5 h-5 ${location ? 'text-green-600' : 'text-slate-400'}`} />
              <span className="font-medium text-slate-700">GPS</span>
            </div>
            <p className="text-sm text-slate-600">
              {location ? 'Tilgjengelig' : 'Venter...'}
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className={`w-5 h-5 ${wifi ? 'text-green-600' : 'text-slate-400'}`} />
              <span className="font-medium text-slate-700">WiFi</span>
            </div>
            <p className="text-sm text-slate-600">
              {wifi?.ssid || 'Ikke tilkoblet'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!status?.checked_in ? (
            <button
              onClick={handleCheckIn}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Clock className="w-6 h-6" />
              {loading ? 'Stempler inn...' : 'Stemple inn'}
            </button>
          ) : (
            <>
              {!activeBreak ? (
                <button
                  onClick={() => handleBreak('start')}
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Coffee className="w-5 h-5" />
                  {loading ? 'Starter pause...' : 'Start pause'}
                </button>
              ) : (
                <button
                  onClick={() => handleBreak('end')}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Coffee className="w-5 h-5" />
                  {loading ? 'Avslutter pause...' : 'Avslutt pause'}
                </button>
              )}

              <button
                onClick={handleCheckOut}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Clock className="w-6 h-6" />
                {loading ? 'Stempler ut...' : 'Stemple ut'}
              </button>
            </>
          )}
        </div>

        {/* Breaks Summary */}
        {status?.breaks && status.breaks.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3">Pauser i dag</h3>
            <div className="space-y-2">
              {status.breaks.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    {new Date(b.break_start).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                    {b.break_end && ` - ${new Date(b.break_end).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}`}
                  </span>
                  {b.break_end && (
                    <span className="text-slate-900 font-medium">
                      {Math.floor((new Date(b.break_end).getTime() - new Date(b.break_start).getTime()) / 60000)} min
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
