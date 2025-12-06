'use client';

import { useState, useEffect } from 'react';
import { Clock, User, Shield, Settings, FileText } from 'lucide-react';

type Activity = {
  id: string;
  action: string;
  resource_type?: string;
  metadata: Record<string, any>;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  };
};

const actionIcons: Record<string, any> = {
  'team.invite_sent': Shield,
  'team.invite_cancelled': Shield,
  'team.member_updated': User,
  'team.member_removed': User,
  'settings.updated': Settings,
  'booking.created': FileText,
};

const actionLabels: Record<string, string> = {
  'team.invite_sent': 'Invitasjon sendt',
  'team.invite_cancelled': 'Invitasjon kansellert',
  'team.member_updated': 'Medlem oppdatert',
  'team.member_removed': 'Medlem fjernet',
};

export default function ActivityLog() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    setLoading(true);
    try {
      const response = await fetch('/api/org/team/activity?limit=50');
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
    setLoading(false);
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Akkurat nå';
    if (diffMins < 60) return `${diffMins} min siden`;
    if (diffHours < 24) return `${diffHours} time${diffHours > 1 ? 'r' : ''} siden`;
    if (diffDays < 7) return `${diffDays} dag${diffDays > 1 ? 'er' : ''} siden`;
    return date.toLocaleDateString('nb-NO');
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        {activities.length} aktivitet{activities.length !== 1 ? 'er' : ''}
      </p>

      {activities.length === 0 ? (
        <div className="card text-center py-12">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">Ingen aktivitet ennå</p>
        </div>
      ) : (
        <div className="card">
          <div className="divide-y divide-slate-200">
            {activities.map((activity) => {
              const Icon = actionIcons[activity.action] || Clock;
              const label = actionLabels[activity.action] || activity.action;

              return (
                <div key={activity.id} className="p-4 hover:bg-slate-50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-slate-900">{label}</p>
                          <p className="text-sm text-slate-600">
                            {activity.user?.full_name || activity.user?.email || 'System'}
                          </p>
                          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                            <div className="mt-2 space-y-1">
                              {activity.metadata.email && (
                                <p className="text-sm text-slate-500">
                                  E-post: {activity.metadata.email}
                                </p>
                              )}
                              {activity.metadata.role && (
                                <p className="text-sm text-slate-500">
                                  Rolle: {activity.metadata.role}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-slate-500 whitespace-nowrap">
                          {formatTime(activity.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
