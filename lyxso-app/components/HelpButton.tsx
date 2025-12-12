"use client";

import { useState, useRef, useEffect } from "react";
import { useHelp } from "@/lib/HelpContext";

type HelpButtonProps = {
  helpId: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
};

export function HelpButton({
  helpId,
  position = "top",
  className = "",
}: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { getHelpItem, isHelpMode } = useHelp();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const helpItem = getHelpItem(helpId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!helpItem) return null;

  // Highlight in help mode
  const helpModeClass = isHelpMode
    ? "ring-2 ring-blue-500 ring-offset-2 animate-pulse"
    : "";

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 transition-all ${helpModeClass} ${className}`}
        aria-label="Hjelp"
        title="Klikk for hjelp"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className={`absolute z-50 w-80 mt-2 ${
            position === "bottom"
              ? "top-full"
              : position === "top"
              ? "bottom-full mb-2"
              : position === "left"
              ? "right-full mr-2"
              : "left-full ml-2"
          }`}
        >
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-4">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <h3 className="text-sm font-semibold text-slate-900 mb-2 pr-6">
              {helpItem.title}
            </h3>

            {/* Content */}
            <p className="text-xs text-slate-600 mb-3">{helpItem.content}</p>

            {/* Links */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              {helpItem.videoUrl && (
                <a
                  href={helpItem.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Se video
                </a>
              )}
              {helpItem.docsUrl && (
                <a
                  href={helpItem.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Les mer
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Tooltip variant for simpler help
type TooltipProps = {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
};

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-slate-900 rounded whitespace-nowrap ${
            position === "top"
              ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
              : position === "bottom"
              ? "top-full left-1/2 -translate-x-1/2 mt-2"
              : position === "left"
              ? "right-full top-1/2 -translate-y-1/2 mr-2"
              : "left-full top-1/2 -translate-y-1/2 ml-2"
          }`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-slate-900 transform rotate-45 ${
              position === "top"
                ? "top-full left-1/2 -translate-x-1/2 -mt-1"
                : position === "bottom"
                ? "bottom-full left-1/2 -translate-x-1/2 -mb-1"
                : position === "left"
                ? "left-full top-1/2 -translate-y-1/2 -ml-1"
                : "right-full top-1/2 -translate-y-1/2 -mr-1"
            }`}
          />
        </div>
      )}
    </div>
  );
}
