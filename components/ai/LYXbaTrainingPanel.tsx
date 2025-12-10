"use client";

import { useState } from "react";
import { Bot, FileText, MessageSquare, Database, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrainingData {
  id: string;
  type: "document" | "conversation" | "knowledge";
  title: string;
  status: "pending" | "processing" | "completed";
  uploadedAt: string;
}

interface Conversation {
  id: string;
  customerName: string;
  contactPhone?: string;
  contactEmail?: string;
  channel: 'sms' | 'email' | 'chat' | 'phone' | 'landing_page';
  status: 'active' | 'completed' | 'handed_off';
  outcome: 'booked' | 'inquiry' | 'support' | 'handed_off' | null;
  serviceInterest?: string;
  lastMessage: string;
  lastMessageAt: string;
  messages: Array<{
    id: string;
    sender: 'customer' | 'bot';
    text: string;
    timestamp: string;
  }>;
}

export interface LYXbaTrainingPanelProps {
  conversation: Conversation;
  onFeedbackSubmit: (conversationId: string, messageId: string, feedback: any) => Promise<void>;
}

export function LYXbaTrainingPanel({ conversation, onFeedbackSubmit }: LYXbaTrainingPanelProps) {
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const handleUploadDocument = async (file: File) => {
    // Simulate upload
    const newData: TrainingData = {
      id: Date.now().toString(),
      type: "document",
      title: file.name,
      status: "pending",
      uploadedAt: new Date().toISOString(),
    };
    setTrainingData((prev) => [...prev, newData]);
  };

  const handleStartTraining = async () => {
    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Conversation Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3 mb-4">
          <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {conversation.customerName}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {conversation.channel} • {conversation.status}
            </p>
          </div>
        </div>
        
        {/* Conversation Details */}
        <div className="space-y-2 text-sm">
          {conversation.contactPhone && (
            <p className="text-slate-600 dark:text-slate-400">
              📞 {conversation.contactPhone}
            </p>
          )}
          {conversation.contactEmail && (
            <p className="text-slate-600 dark:text-slate-400">
              ✉️ {conversation.contactEmail}
            </p>
          )}
          {conversation.serviceInterest && (
            <p className="text-slate-600 dark:text-slate-400">
              🔧 {conversation.serviceInterest}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        <h4 className="font-medium text-slate-900 dark:text-white">Samtalehistorikk</h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.sender === 'customer'
                  ? 'bg-blue-50 dark:bg-blue-900/20 ml-8'
                  : 'bg-slate-50 dark:bg-slate-800 mr-8'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {message.sender === 'customer' ? conversation.customerName : 'LYXba'}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(message.timestamp).toLocaleString('nb-NO')}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">{message.text}</p>
              
              {/* Feedback buttons for bot messages */}
              {message.sender === 'bot' && (
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onFeedbackSubmit(conversation.id, message.id, { rating: 'positive' })}
                  >
                    👍 Bra
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onFeedbackSubmit(conversation.id, message.id, { rating: 'negative' })}
                  >
                    👎 Dårlig
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Training Status */}
      {isTraining && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Trener modell...
            </span>
            <span className="font-medium text-purple-600 dark:text-purple-400">
              {trainingProgress}%
            </span>
          </div>
          <Progress value={trainingProgress} className="h-2" />
        </div>
      )}
    </div>
  );
}
