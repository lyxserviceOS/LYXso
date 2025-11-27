// app/(protected)/ai-agent/page.tsx
"use client";

import { useState } from "react";
import { sendAIAssistantMessage } from "@/repos/aiAssistantRepo";

export default function AIAgentPage() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await sendAIAssistantMessage(message);
      setReply(res.reply);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold text-slate-900">
        AI-agent (LYXba / assistent)
      </h1>
      <p className="mb-4 text-xs text-slate-500">
        Dette er en enkel demo. Senere kobles den på ekte LYXba-logikk
        (leads, booking, kampanjer osv.).
      </p>

      <textarea
        className="w-full rounded border border-slate-300 p-2 text-sm"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Skriv en beskjed til AI-agenten …"
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="mt-3 rounded bg-slate-900 px-4 py-1.5 text-xs font-medium text-slate-50 hover:bg-slate-800 disabled:opacity-50"
      >
        {loading ? "Sender …" : "Send"}
      </button>

      {reply && (
        <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          {reply}
        </div>
      )}
    </div>
  );
}
