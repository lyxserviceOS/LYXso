// components/marketing/CloudMediaPicker.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Image as ImageIcon, Video, FolderOpen, Check } from 'lucide-react';
import Image from 'next/image';

interface CloudFile {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  type: 'image' | 'video';
  provider: 'dropbox' | 'google_drive';
  size: number;
  modified: string;
}

interface CloudMediaPickerProps {
  onSelect: (file: CloudFile) => void;
  selectedFile?: CloudFile;
  apiBaseUrl: string;
  orgId: string;
}

export default function CloudMediaPicker({
  onSelect,
  selectedFile,
  apiBaseUrl,
  orgId
}: CloudMediaPickerProps) {
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState<'dropbox' | 'google_drive' | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/orgs/${orgId}/social/cloud-status`);
      if (res.ok) {
        const data = await res.json();
        setConnected(data.connected);
        setProvider(data.provider);
        if (data.connected) {
          fetchFiles(data.provider);
        }
      }
    } catch (err) {
      console.error('Failed to check cloud connection:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async (cloudProvider: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/orgs/${orgId}/social/cloud-images?provider=${cloudProvider}`
      );
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      } else {
        throw new Error('Kunne ikke hente filer');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const connectDropbox = () => {
    // Open Dropbox OAuth flow
    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DROPBOX_APP_KEY}&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin + '/api/cloud/callback')}`;
    window.location.href = authUrl;
  };

  const connectGoogleDrive = () => {
    // Open Google Drive OAuth flow
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/api/cloud/callback')}&response_type=code&scope=https://www.googleapis.com/auth/drive.readonly&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Laster...</p>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8">
        <div className="text-center max-w-md mx-auto">
          <Cloud className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Koble til skylagring
          </h3>
          <p className="text-slate-600 mb-6">
            Koble til Dropbox eller Google Drive for å bruke bilder og videoer i dine innlegg
          </p>
          
          <div className="space-y-3">
            <button
              onClick={connectDropbox}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z"/>
              </svg>
              Koble til Dropbox
            </button>
            
            <button
              onClick={connectGoogleDrive}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border-2 border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.71 3.5L1.15 15l3.85 6.5L11.5 9.5 7.71 3.5zM14.5 0l7.55 13h-7.1L7.4 0h7.1zm2.79 13L12 24H23.85l5.15-11h-11.71z" fill="#1B73E8"/>
              </svg>
              Koble til Google Drive
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => fetchFiles(provider!)}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Prøv igjen
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">
            Bilder og videoer fra {provider === 'dropbox' ? 'Dropbox' : 'Google Drive'}
          </h3>
        </div>
        <div className="text-sm text-slate-600">
          {files.length} filer
        </div>
      </div>

      {/* Files Grid */}
      {files.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Ingen filer funnet</p>
          <p className="text-sm mt-1">Last opp bilder/videoer til din skylagring</p>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {files.map(file => (
            <button
              key={file.id}
              onClick={() => onSelect(file)}
              className={`
                relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                ${selectedFile?.id === file.id 
                  ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2' 
                  : 'border-slate-200 hover:border-slate-300'
                }
              `}
            >
              {/* File Preview */}
              {file.type === 'image' ? (
                <Image
                  src={file.thumbnail || file.url}
                  alt={file.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <Video className="h-8 w-8 text-white" />
                </div>
              )}

              {/* Selected Check */}
              {selectedFile?.id === file.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}

              {/* File Name Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-xs truncate">{file.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
