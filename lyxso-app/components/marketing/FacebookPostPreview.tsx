// components/marketing/FacebookPostPreview.tsx
'use client';

import React from 'react';
import { ThumbsUp, MessageCircle, Share2, Globe } from 'lucide-react';
import Image from 'next/image';

interface FacebookPostPreviewProps {
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  businessName: string;
  businessLogo?: string;
  hashtags?: string[];
}

export default function FacebookPostPreview({
  content,
  imageUrl,
  videoUrl,
  businessName,
  businessLogo,
  hashtags = []
}: FacebookPostPreviewProps) {
  const now = new Date();
  const timeAgo = 'akkurat nå';

  return (
    <div className="bg-white rounded-lg border border-slate-300 overflow-hidden max-w-xl mx-auto shadow-lg">
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
          {businessLogo ? (
            <Image
              src={businessLogo}
              alt={businessName}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            businessName.charAt(0).toUpperCase()
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-900">{businessName}</div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            {timeAgo} · <Globe className="h-3 w-3" />
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-600">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-slate-900 whitespace-pre-wrap break-words">
          {content}
        </p>
        {hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {hashtags.map((tag, i) => (
              <span key={i} className="text-blue-600 hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media */}
      {imageUrl && (
        <div className="relative w-full aspect-video bg-slate-100">
          <Image
            src={imageUrl}
            alt="Post image"
            fill
            className="object-cover"
          />
        </div>
      )}

      {videoUrl && (
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            <div className="text-sm">Video forhåndsvisning</div>
          </div>
        </div>
      )}

      {/* Interaction Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-slate-600 border-t border-slate-200">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
              👍
            </div>
            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">
              ❤️
            </div>
          </div>
          <span>42</span>
        </div>
        <div className="flex items-center gap-3">
          <span>12 kommentarer</span>
          <span>5 delinger</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-2 border-t border-slate-200 grid grid-cols-3 gap-2">
        <button className="flex items-center justify-center gap-2 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <ThumbsUp className="h-5 w-5" />
          <span className="font-medium">Lik</span>
        </button>
        <button className="flex items-center justify-center gap-2 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <MessageCircle className="h-5 w-5" />
          <span className="font-medium">Kommenter</span>
        </button>
        <button className="flex items-center justify-center gap-2 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <Share2 className="h-5 w-5" />
          <span className="font-medium">Del</span>
        </button>
      </div>

      {/* Preview Badge */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
        📱 Forhåndsvisning · Slik vil innlegget se ut
      </div>
    </div>
  );
}
