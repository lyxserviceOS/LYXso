/**
 * Skeleton Loading Components
 * 
 * Research-backed loading states:
 * - Skeleton screens reduce perceived loading time by 35% (Luke Wroblewski)
 * - Users prefer skeleton screens over spinners by 27% (Nielsen Norman Group)
 * - Pulse animation creates expectation of imminent content
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-slate-800/50';
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${variantClasses[variant]} ${className}`}
      style={style}
      role="status"
      aria-label="Laster..."
    />
  );
}

// Predefined skeleton patterns for common use cases

export function BookingSkeleton() {
  return (
    <div className="border border-slate-700/50 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
      </div>
      <Skeleton variant="text" width="60%" />
      <div className="flex items-center gap-4 pt-2">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="30%" />
        </div>
      </div>
    </div>
  );
}

export function BookingListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <BookingSkeleton key={i} />
      ))}
    </div>
  );
}

export function CustomerCardSkeleton() {
  return (
    <div className="border border-slate-700/50 rounded-lg p-4">
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
          <div className="flex gap-2 pt-2">
            <Skeleton variant="rectangular" width={60} height={20} className="rounded-full" />
            <Skeleton variant="rectangular" width={80} height={20} className="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomerListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CustomerCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="border border-slate-700/50 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/30 p-4 border-b border-slate-700/50">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="text" width="70%" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4 border-b border-slate-700/50 last:border-0">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} variant="text" width={colIndex === 0 ? '90%' : '60%'} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-slate-800/20 border border-slate-700/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
      </div>
      <Skeleton variant="text" width="50%" className="h-8 mb-2" />
      <Skeleton variant="text" width="70%" />
    </div>
  );
}

export function DashboardStatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Skeleton variant="text" width={120} height={20} />
        <Skeleton variant="text" width="100%" height={40} className="rounded-lg" />
      </div>
      
      {/* Fields */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" width={100} height={16} />
          <Skeleton variant="text" width="100%" height={40} className="rounded-lg" />
        </div>
      ))}
      
      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Skeleton variant="rectangular" width={100} height={40} className="rounded-lg" />
        <Skeleton variant="rectangular" width={80} height={40} className="rounded-lg" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="border border-slate-700/50 rounded-lg p-6">
      <div className="space-y-4">
        <Skeleton variant="text" width="40%" className="h-6" />
        <div className="flex items-end justify-between h-64 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              className="flex-1"
              height={Math.random() * 200 + 64}
            />
          ))}
        </div>
        <div className="flex justify-between pt-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} variant="text" width={40} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="border border-slate-700/50 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/30 p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width={150} className="h-6" />
          <div className="flex gap-2">
            <Skeleton variant="rectangular" width={80} height={32} className="rounded-lg" />
            <Skeleton variant="rectangular" width={100} height={32} className="rounded-lg" />
          </div>
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} variant="text" width="100%" className="h-4" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="aspect-square" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" width={200} className="h-8" />
          <Skeleton variant="text" width={300} />
        </div>
        <Skeleton variant="rectangular" width={140} height={40} className="rounded-lg" />
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="w-64 border-r border-slate-700/50 p-4 space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton variant="rectangular" width={20} height={20} />
          <Skeleton variant="text" width="60%" />
        </div>
      ))}
    </div>
  );
}

// Generic Page Skeleton
export function PageSkeleton() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      <DashboardStatsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
}
