'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Clock } from 'lucide-react';
import MembersList from './MembersList';
import InvitationsList from './InvitationsList';
import InviteModal from './InviteModal';
import ActivityLog from './ActivityLog';

type Tab = 'members' | 'invitations' | 'activity';

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState<Tab>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const tabs = [
    { id: 'members', label: 'Team Members', icon: Users },
    { id: 'invitations', label: 'Invitasjoner', icon: UserPlus },
    { id: 'activity', label: 'Aktivitetslogg', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-1 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'members' && (
        <MembersList onInvite={() => setShowInviteModal(true)} />
      )}
      
      {activeTab === 'invitations' && (
        <InvitationsList onInvite={() => setShowInviteModal(true)} />
      )}
      
      {activeTab === 'activity' && (
        <ActivityLog />
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
}
