// components/marketing/PublishingCalendar.tsx
'use client';

import React, { useState } from 'react';
import { Calendar, Check, X } from 'lucide-react';

interface PublishingCalendarProps {
  selectedDates: string[]; // Array of ISO date strings
  onDatesChange: (dates: string[]) => void;
  maxDays?: number;
}

export default function PublishingCalendar({ 
  selectedDates, 
  onDatesChange, 
  maxDays = 30 
}: PublishingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + maxDays);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before month starts
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const toggleDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    if (selectedDates.includes(dateStr)) {
      onDatesChange(selectedDates.filter(d => d !== dateStr));
    } else {
      onDatesChange([...selectedDates, dateStr].sort());
    }
  };

  const isDateSelected = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return selectedDates.includes(dateStr);
  };

  const isDateDisabled = (date: Date) => {
    return date < today || date > maxDate;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];

  const nextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const prevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prev);
    }
  };

  const selectAllInMonth = () => {
    const monthDates = days
      .filter(day => day && !isDateDisabled(day))
      .map(day => day!.toISOString().split('T')[0]);
    
    const newDates = [...new Set([...selectedDates, ...monthDates])].sort();
    onDatesChange(newDates);
  };

  const clearAllInMonth = () => {
    const monthDates = days
      .filter(day => day)
      .map(day => day!.toISOString().split('T')[0]);
    
    const newDates = selectedDates.filter(d => !monthDates.includes(d));
    onDatesChange(newDates);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Velg publiseringsdager
        </h3>
        <div className="text-sm text-slate-600">
          {selectedDates.length} dager valgt
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={currentMonth <= new Date(today.getFullYear(), today.getMonth(), 1)}
          className="px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Forrige
        </button>
        
        <div className="text-center">
          <div className="font-semibold text-slate-900">
            {currentMonth.toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' })}
          </div>
        </div>
        
        <button
          onClick={nextMonth}
          className="px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded"
        >
          Neste →
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={selectAllInMonth}
          className="flex-1 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
        >
          <Check className="h-4 w-4 inline mr-1" />
          Velg alle i måned
        </button>
        <button
          onClick={clearAllInMonth}
          className="flex-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <X className="h-4 w-4 inline mr-1" />
          Fjern alle i måned
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-600 py-2">
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const selected = isDateSelected(day);
          const disabled = isDateDisabled(day);
          const isToday = day.toDateString() === today.toDateString();

          return (
            <button
              key={day.toISOString()}
              onClick={() => !disabled && toggleDate(day)}
              disabled={disabled}
              className={`
                aspect-square rounded-lg text-sm font-medium transition-all
                ${disabled 
                  ? 'text-slate-300 cursor-not-allowed bg-slate-50' 
                  : 'hover:bg-blue-50 cursor-pointer'
                }
                ${selected && !disabled
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-slate-700'
                }
                ${isToday && !selected ? 'ring-2 ring-blue-600 ring-offset-1' : ''}
              `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      {/* Selected Dates Summary */}
      {selectedDates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600 mb-2">
            Valgte datoer ({selectedDates.length}):
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {selectedDates.slice(0, 10).map(dateStr => (
              <span
                key={dateStr}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg"
              >
                {new Date(dateStr).toLocaleDateString('nb-NO', { 
                  day: 'numeric', 
                  month: 'short' 
                })}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-blue-900"
                  onClick={() => onDatesChange(selectedDates.filter(d => d !== dateStr))}
                />
              </span>
            ))}
            {selectedDates.length > 10 && (
              <span className="text-xs text-slate-500">
                +{selectedDates.length - 10} flere...
              </span>
            )}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 text-xs text-slate-500">
        💡 Tips: Du kan planlegge opptil {maxDays} dager frem i tid
      </div>
    </div>
  );
}
