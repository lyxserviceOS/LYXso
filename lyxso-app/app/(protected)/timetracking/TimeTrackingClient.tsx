'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'
import { 
  Clock, 
  MapPin, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  Activity
} from 'lucide-react'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

interface TimeEntry {
  id: string
  user_id: string
  organization_id: string
  check_in: string
  check_out: string | null
  location_lat: number | null
  location_lng: number | null
  wifi_ssid: string | null
  wifi_verified: boolean
  total_hours: number | null
  notes: string | null
  created_at: string
}

interface WorkDay {
  date: string
  entries: TimeEntry[]
  total_hours: number
  status: 'complete' | 'incomplete' | 'ongoing'
}

export default function TimeTrackingClient() {
  const [loading, setLoading] = useState(true)
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null)
  const [recentEntries, setRecentEntries] = useState<TimeEntry[]>([])
  const [weekSummary, setWeekSummary] = useState<WorkDay[]>([])
  const [wifiStatus, setWifiStatus] = useState<{
    connected: boolean
    ssid: string | null
    verified: boolean
  }>({ connected: false, ssid: null, verified: false })
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
  const [canCheckIn, setCanCheckIn] = useState(false)
  const [organizationWifi, setOrganizationWifi] = useState<string[]>([])
  
  const supabase = createClient()

  useEffect(() => {
    loadData()
    checkWifiStatus()
    getCurrentLocation()
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      loadData()
      checkWifiStatus()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Check if user can check in based on WiFi verification
    if (organizationWifi.length > 0 && wifiStatus.ssid) {
      const verified = organizationWifi.includes(wifiStatus.ssid)
      setWifiStatus(prev => ({ ...prev, verified }))
      setCanCheckIn(verified)
    }
  }, [wifiStatus.ssid, organizationWifi])

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get user's organization
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      if (!profileData?.organization_id) return

      // Get organization WiFi networks
      const { data: orgData } = await supabase
        .from('organizations')
        .select('allowed_wifi_networks')
        .eq('id', profileData.organization_id)
        .single()

      if (orgData?.allowed_wifi_networks) {
        setOrganizationWifi(orgData.allowed_wifi_networks)
      }

      // Get active time entry
      const { data: activeData } = await supabase
        .from('time_entries')
        .select('*')
        .eq('user_id', user.id)
        .is('check_out', null)
        .order('check_in', { ascending: false })
        .limit(1)
        .single()

      setActiveEntry(activeData || null)

      // Get recent entries (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data: entriesData } = await supabase
        .from('time_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('check_in', sevenDaysAgo.toISOString())
        .order('check_in', { ascending: false })

      setRecentEntries(entriesData || [])
      
      // Calculate week summary
      if (entriesData) {
        const summary = calculateWeekSummary(entriesData)
        setWeekSummary(summary)
      }

    } catch (error) {
      console.error('Error loading time tracking data:', error)
      toast.error('Kunne ikke laste tidsdata')
    } finally {
      setLoading(false)
    }
  }

  async function checkWifiStatus() {
    try {
      // In a real implementation, this would use a native API or browser API
      // For web, we can use the Network Information API (limited support)
      if ('connection' in navigator) {
        const conn = (navigator as any).connection
        const ssid = conn?.effectiveType || 'unknown'
        setWifiStatus({
          connected: navigator.onLine,
          ssid: ssid,
          verified: false
        })
      } else {
        setWifiStatus({
          connected: navigator.onLine,
          ssid: 'web-browser',
          verified: false
        })
      }
    } catch (error) {
      console.error('Error checking WiFi:', error)
    }
  }

  function getCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('Kunne ikke hente posisjon')
        }
      )
    }
  }

  function calculateWeekSummary(entries: TimeEntry[]): WorkDay[] {
    const days: { [key: string]: TimeEntry[] } = {}
    
    entries.forEach(entry => {
      const date = entry.check_in.split('T')[0]
      if (!days[date]) {
        days[date] = []
      }
      days[date].push(entry)
    })

    return Object.entries(days).map(([date, dayEntries]) => {
      const totalHours = dayEntries.reduce((sum, entry) => {
        return sum + (entry.total_hours || 0)
      }, 0)

      let status: 'complete' | 'incomplete' | 'ongoing' = 'complete'
      if (dayEntries.some(e => !e.check_out)) {
        status = 'ongoing'
      } else if (totalHours < 7.5) {
        status = 'incomplete'
      }

      return {
        date,
        entries: dayEntries,
        total_hours: totalHours,
        status
      }
    }).sort((a, b) => b.date.localeCompare(a.date))
  }

  async function handleCheckIn() {
    if (!canCheckIn && organizationWifi.length > 0) {
      toast.error('Du må være koblet til bedriftens WiFi for å stemple inn')
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      if (!profileData?.organization_id) return

      const { data, error } = await supabase
        .from('time_entries')
        .insert({
          user_id: user.id,
          organization_id: profileData.organization_id,
          check_in: new Date().toISOString(),
          location_lat: location?.lat,
          location_lng: location?.lng,
          wifi_ssid: wifiStatus.ssid,
          wifi_verified: wifiStatus.verified
        })
        .select()
        .single()

      if (error) throw error

      setActiveEntry(data)
      toast.success('✅ Stemplet inn!', {
        duration: 3000,
        icon: '👋'
      })
      
      await loadData()
    } catch (error) {
      console.error('Error checking in:', error)
      toast.error('Kunne ikke stemple inn')
    }
  }

  async function handleCheckOut() {
    if (!activeEntry) return

    try {
      const checkInTime = new Date(activeEntry.check_in)
      const checkOutTime = new Date()
      const diffMs = checkOutTime.getTime() - checkInTime.getTime()
      const totalHours = diffMs / (1000 * 60 * 60)

      const { error } = await supabase
        .from('time_entries')
        .update({
          check_out: checkOutTime.toISOString(),
          total_hours: Math.round(totalHours * 100) / 100
        })
        .eq('id', activeEntry.id)

      if (error) throw error

      setActiveEntry(null)
      toast.success(`✅ Stemplet ut! Arbeidet: ${Math.round(totalHours * 10) / 10} timer`, {
        duration: 4000,
        icon: '👋'
      })
      
      await loadData()
    } catch (error) {
      console.error('Error checking out:', error)
      toast.error('Kunne ikke stemple ut')
    }
  }

  function formatTime(isoString: string) {
    return new Date(isoString).toLocaleTimeString('no-NO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function formatDate(isoString: string) {
    return new Date(isoString).toLocaleDateString('no-NO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function calculateElapsedTime() {
    if (!activeEntry) return '0:00'
    
    const now = new Date()
    const checkIn = new Date(activeEntry.check_in)
    const diff = now.getTime() - checkIn.getTime()
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}:${minutes.toString().padStart(2, '0')}`
  }

  const totalWeekHours = weekSummary.reduce((sum, day) => sum + day.total_hours, 0)

  if (loading) {
    return (
      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <LoadingSkeleton rows={3} />
        <LoadingSkeleton rows={3} />
        <LoadingSkeleton rows={3} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              Tidsstyring
            </h1>
            <p className="text-slate-600 mt-1">Stemple inn/ut og oversikt over arbeidstid</p>
          </div>
          
          {/* WiFi Status Indicator */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            wifiStatus.verified 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {wifiStatus.verified ? (
              <>
                <Wifi className="w-5 h-5" />
                <span className="font-medium">WiFi Verifisert</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5" />
                <span className="font-medium">Ikke på bedriftens WiFi</span>
              </>
            )}
          </div>
        </div>

        {/* Main Check-in/out Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {activeEntry ? (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                <Activity className="w-10 h-10 text-green-600 animate-pulse" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Du er inne på jobb</h2>
                <p className="text-slate-600">Stemplet inn kl. {formatTime(activeEntry.check_in)}</p>
              </div>

              <div className="text-6xl font-bold text-blue-600 tracking-tight">
                {calculateElapsedTime()}
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                {activeEntry.wifi_verified && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>WiFi verifisert</span>
                  </div>
                )}
                {activeEntry.location_lat && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Lokasjon registrert</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckOut}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Stemple ut
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                <Clock className="w-10 h-10 text-blue-600" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Klar til å starte dagen?</h2>
                <p className="text-slate-600">
                  {canCheckIn 
                    ? 'Du kan nå stemple inn' 
                    : organizationWifi.length > 0 
                      ? 'Du må være på bedriftens WiFi for å stemple inn'
                      : 'WiFi-verifisering ikke konfigurert'}
                </p>
              </div>

              {!canCheckIn && organizationWifi.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left max-w-md mx-auto">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-amber-900 mb-1">WiFi-krav aktivert</p>
                      <p className="text-amber-700">
                        Koble til et av bedriftens WiFi-nettverk for å stemple inn.
                        Dette sikrer at du er fysisk til stede på arbeidsplassen.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleCheckIn}
                disabled={!canCheckIn && organizationWifi.length > 0}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all transform shadow-lg ${
                  canCheckIn || organizationWifi.length === 0
                    ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-105'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Stemple inn
              </button>
            </div>
          )}
        </div>

        {/* Week Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Denne uken</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {Math.round(totalWeekHours * 10) / 10}t
            </div>
            <p className="text-sm text-slate-600">
              {weekSummary.length} arbeidsdager registrert
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Gjennomsnittsdag</h3>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-4xl font-bold text-slate-900 mb-2">
              {weekSummary.length > 0 ? Math.round((totalWeekHours / weekSummary.length) * 10) / 10 : 0}t
            </div>
            <p className="text-sm text-slate-600">
              Timer per dag
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Status</h3>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-2">
              {weekSummary.filter(d => d.status === 'complete').length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Fullførte dager</span>
                  <span className="font-semibold text-green-600">
                    {weekSummary.filter(d => d.status === 'complete').length}
                  </span>
                </div>
              )}
              {weekSummary.filter(d => d.status === 'ongoing').length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Pågående</span>
                  <span className="font-semibold text-blue-600">
                    {weekSummary.filter(d => d.status === 'ongoing').length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Siste 7 dager
          </h3>
          
          <div className="space-y-4">
            {weekSummary.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Ingen registrerte tidspunkter enda</p>
                <p className="text-sm mt-1">Stemple inn for å begynne</p>
              </div>
            ) : (
              weekSummary.map((day) => (
                <div key={day.date} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        day.status === 'complete' ? 'bg-green-500' :
                        day.status === 'ongoing' ? 'bg-blue-500 animate-pulse' :
                        'bg-amber-500'
                      }`} />
                      <span className="font-medium text-slate-900">
                        {formatDate(day.date)}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">
                      {Math.round(day.total_hours * 10) / 10}t
                    </span>
                  </div>
                  
                  <div className="space-y-2 ml-5">
                    {day.entries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <span>{formatTime(entry.check_in)}</span>
                          <span>→</span>
                          <span>{entry.check_out ? formatTime(entry.check_out) : 'Pågående'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {entry.wifi_verified && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                          {!entry.wifi_verified && entry.wifi_ssid && (
                            <XCircle className="w-4 h-4 text-amber-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
