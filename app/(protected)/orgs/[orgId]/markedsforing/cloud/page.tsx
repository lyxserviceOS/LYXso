"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Cloud, Upload, Calendar, Sparkles, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_URL = getApiBaseUrl();

export default function CloudPublishingPage() {
  const params = useParams();
  const orgId = params?.orgId as string;

  const [cloudProvider, setCloudProvider] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [folders, setFolders] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [images, setImages] = useState<any[]>([]);
  const [analyzedImages, setAnalyzedImages] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [publishMode, setPublishMode] = useState<string>("single");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [timeOfDay, setTimeOfDay] = useState<string>("10:00");
  const [loading, setLoading] = useState(false);
  const [pageId, setPageId] = useState<string>("");
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    checkCloudConnection();
    loadMetaPages();
  }, [orgId]);

  const checkCloudConnection = async () => {
    // TODO: Check if cloud is connected
    // For now, just load from localStorage
    const dropboxConnected = localStorage.getItem(`dropbox-connected-${orgId}`);
    if (dropboxConnected === "true") {
      setIsConnected(true);
      setCloudProvider("dropbox");
    }
  };

  const loadMetaPages = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/orgs/${orgId}/marketing/meta/pages`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
        if (data.pages?.length > 0) {
          setPageId(data.pages[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load Meta pages:", err);
    }
  };

  const connectDropbox = () => {
    window.location.href = `${API_URL}/api/orgs/${orgId}/marketing/cloud/connect/dropbox`;
  };

  const loadFolders = async () => {
    if (!cloudProvider) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/orgs/${orgId}/marketing/cloud/folders?provider=${cloudProvider}`,
        { credentials: "include" }
      );
      
      if (res.ok) {
        const data = await res.json();
        setFolders(data.folders || []);
      }
    } catch (err) {
      console.error("Failed to load folders:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async () => {
    if (!selectedFolder || !cloudProvider) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/orgs/${orgId}/marketing/cloud/images?provider=${cloudProvider}&folderPath=${encodeURIComponent(selectedFolder)}`,
        { credentials: "include" }
      );
      
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
      }
    } catch (err) {
      console.error("Failed to load images:", err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImages = async () => {
    if (selectedImages.length === 0) return;
    
    setLoading(true);
    try {
      const imagesToAnalyze = images
        .filter(img => selectedImages.includes(img.id))
        .map(img => ({ path: img.path, name: img.name }));
      
      const res = await fetch(
        `${API_URL}/api/orgs/${orgId}/marketing/cloud/analyze-images`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            provider: cloudProvider,
            images: imagesToAnalyze
          })
        }
      );
      
      if (res.ok) {
        const data = await res.json();
        setAnalyzedImages(data.images || []);
      }
    } catch (err) {
      console.error("Failed to analyze images:", err);
    } finally {
      setLoading(false);
    }
  };

  const schedulePublishing = async () => {
    if (!pageId || analyzedImages.length === 0) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/orgs/${orgId}/marketing/cloud/schedule`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            mode: publishMode,
            images: analyzedImages,
            startDate: scheduledDate || new Date().toISOString(),
            timeOfDay: timeOfDay,
            pageId: pageId,
            platform: "meta"
          })
        }
      );
      
      if (res.ok) {
        const data = await res.json();
        alert(`✅ ${data.scheduled} innlegg planlagt!`);
        
        // Reset state
        setAnalyzedImages([]);
        setSelectedImages([]);
      }
    } catch (err) {
      console.error("Failed to schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && cloudProvider) {
      loadFolders();
    }
  }, [isConnected, cloudProvider]);

  useEffect(() => {
    if (selectedFolder) {
      loadImages();
    }
  }, [selectedFolder]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Cloud className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Cloud Publishing</h1>
          <p className="text-muted-foreground">
            Koble til sky-tjeneste og publiser automatisk med AI
          </p>
        </div>
      </div>

      {/* Cloud Connection */}
      <Card>
        <CardHeader>
          <CardTitle>1. Koble til sky-tjeneste</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="space-y-4">
              <Label>Velg sky-leverandør</Label>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={cloudProvider === "dropbox" ? "default" : "outline"}
                  onClick={() => setCloudProvider("dropbox")}
                  className="h-20"
                >
                  <div className="text-center">
                    <Cloud className="w-6 h-6 mx-auto mb-2" />
                    Dropbox
                  </div>
                </Button>
                <Button
                  variant="outline"
                  disabled
                  className="h-20 opacity-50"
                >
                  <div className="text-center">
                    <Cloud className="w-6 h-6 mx-auto mb-2" />
                    OneDrive<br/>
                    <span className="text-xs">(kommer snart)</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  disabled
                  className="h-20 opacity-50"
                >
                  <div className="text-center">
                    <Cloud className="w-6 h-6 mx-auto mb-2" />
                    Google Drive<br/>
                    <span className="text-xs">(kommer snart)</span>
                  </div>
                </Button>
              </div>
              
              {cloudProvider && (
                <Button onClick={connectDropbox} size="lg" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Koble til {cloudProvider}
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-medium">Tilkoblet {cloudProvider}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Folder Selection */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>2. Velg mappe med bilder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Velg mappe</Label>
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger>
                <SelectValue placeholder="Velg en mappe" />
              </SelectTrigger>
              <SelectContent>
                {folders.map(folder => (
                  <SelectItem key={folder.id} value={folder.path}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          </CardContent>
        </Card>
      )}

      {/* Image Selection */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>3. Velg bilder å publisere</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {images.map(image => (
                <div
                  key={image.id}
                  className={`border-2 rounded-lg p-2 cursor-pointer transition ${
                    selectedImages.includes(image.id)
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedImages(prev =>
                      prev.includes(image.id)
                        ? prev.filter(id => id !== image.id)
                        : [...prev, image.id]
                    );
                  }}
                >
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">{image.name}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Button
              onClick={analyzeImages}
              disabled={selectedImages.length === 0 || loading}
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Analyser med AI ({selectedImages.length} bilder)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analyzed Images */}
      {analyzedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>4. AI-genererte innlegg</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyzedImages.map((img, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <span className="font-medium">{img.name}</span>
                  <Badge variant="outline">Score: {img.aiAnalysis?.score || 0}/10</Badge>
                </div>
                <Textarea
                  value={img.aiAnalysis?.text || ""}
                  onChange={e => {
                    const updated = [...analyzedImages];
                    updated[idx].aiAnalysis.text = e.target.value;
                    setAnalyzedImages(updated);
                  }}
                  rows={3}
                />
                <div className="flex gap-2 flex-wrap">
                  {(img.aiAnalysis?.hashtags || []).map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary">#{tag}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Scheduling */}
      {analyzedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>5. Planlegg publisering</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Facebook Side</Label>
              <Select value={pageId} onValueChange={setPageId}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg side" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map(page => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Publiseringsmodus</Label>
              <Select value={publishMode} onValueChange={setPublishMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Publiser én gang nå</SelectItem>
                  <SelectItem value="daily">Daglig publisering (1 bilde per dag)</SelectItem>
                  <SelectItem value="monthly">Månedlig plan (alle bilder)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {publishMode !== "single" && (
              <>
                <div className="space-y-2">
                  <Label>Startdato</Label>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tidspunkt</Label>
                  <Input
                    type="time"
                    value={timeOfDay}
                    onChange={e => setTimeOfDay(e.target.value)}
                  />
                </div>
              </>
            )}

            <Button
              onClick={schedulePublishing}
              disabled={!pageId || loading}
              size="lg"
              className="w-full"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {publishMode === "single" 
                ? "Publiser nå" 
                : `Planlegg ${analyzedImages.length} innlegg`}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
