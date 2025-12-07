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

interface LYXbaTrainingPanelProps {
  orgId: string;
}

export function LYXbaTrainingPanel({ orgId }: LYXbaTrainingPanelProps) {
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
      {/* Training Status */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3 mb-4">
          <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              LYXba AI-assistent
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tren din AI-assistent med egendefinert innhold
            </p>
          </div>
        </div>

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

      {/* Training Tabs */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Dokumenter
          </TabsTrigger>
          <TabsTrigger value="conversations" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Samtaler
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Kunnskapsbase
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Last opp dokumenter
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Last opp PDF, Word eller tekst-filer for å trene LYXba
            </p>
            <Button variant="outline">
              <label className="cursor-pointer">
                Velg filer
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach(handleUploadDocument);
                  }}
                />
              </label>
            </Button>
          </div>

          {trainingData.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-slate-900 dark:text-white">
                Opplastede filer ({trainingData.length})
              </h4>
              <div className="space-y-2">
                {trainingData.map((data) => (
                  <div
                    key={data.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {data.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(data.uploadedAt).toLocaleDateString("nb-NO")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        data.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : data.status === "processing"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {data.status === "completed"
                        ? "Fullført"
                        : data.status === "processing"
                        ? "Behandler"
                        : "Venter"}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleStartTraining}
                disabled={isTraining}
                className="w-full mt-4"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isTraining ? "Trener..." : "Start trening"}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Treningsamtaler
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Kommende funksjon: Tren LYXba med eksempel-samtaler
            </p>
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Kunnskapsbase
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Kommende funksjon: Administrer kunnskapsbasen til LYXba
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
