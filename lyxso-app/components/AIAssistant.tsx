// components/AIAssistant.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useOrgPlan } from "./OrgPlanContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const { org } = useOrgPlan();
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Vis prompt-boble etter 5 sekunder
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowPrompt(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Auto-scroll til bunnen når nye meldinger kommer
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
      const response = await fetch(`${apiBase}/api/orgs/${org?.id}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          context: "assistant", // Generell hjelp-kontekst
        }),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke få svar fra AI");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "Beklager, jeg kunne ikke svare på det.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Feil ved AI-chat:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Beklager, jeg har problemer med å svare akkurat nå. Prøv igjen om litt.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setShowPrompt(false);
  };

  return (
    <>
      {/* Prompt-boble */}
      {showPrompt && !isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 animate-fade-in cursor-pointer"
          onClick={openChat}
        >
          <div className="relative max-w-xs rounded-2xl bg-blue-600 px-4 py-3 text-sm text-white shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPrompt(false);
              }}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-xs hover:bg-slate-600"
            >
              ×
            </button>
            <p className="font-medium">Trenger du hjelp?</p>
            <p className="text-xs text-blue-100">
              Jeg har svaret på det meste.
            </p>
          </div>
          {/* Liten trekant */}
          <div className="absolute bottom-0 right-4 h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-600" />
        </div>
      )}

      {/* Chat-ikon (alltid synlig) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 ${
          isOpen ? "bg-slate-700" : "bg-blue-600"
        }`}
        aria-label="AI Assistent"
      >
        {isOpen ? (
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chat-vindu */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-96 flex-col rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-blue-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  LYX Assistent
                </h3>
                <p className="text-xs text-blue-100">Alltid her for å hjelpe</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-100"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Meldinger */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                <svg
                  className="h-16 w-16 mb-3 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <p className="text-sm font-medium text-slate-700">
                  Hei! Hvordan kan jeg hjelpe deg i dag?
                </p>
                <p className="text-xs mt-1">
                  Still meg spørsmål om booking, kunder, tjenester, eller noe
                  annet.
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      msg.role === "user" ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString("nb-NO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Skriv en melding..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
