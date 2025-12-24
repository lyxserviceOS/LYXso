"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Image, Calendar, Clock, Zap, TrendingUp, CheckCircle2, Droplet, Upload } from "lucide-react";
import { toast } from "sonner";
import { getApiBaseUrl } from "@/lib/apiConfig";

interface CloudImage {
  provider: string;
  id: string;
  name: string;
  path?: string;
  thumbnail?: string;
  aiAnalysis?: {
    description: string;
    keywords: string[];
    score?: number;
  };
  generatedContent?: {
    message: string;
    hashtags: string[];
  };
}

export default function AutomaticPublishingPage() {
  // For now, use a mock organization ID - should be replaced with Supabase auth
  const orgId = "mock-org-id";
  const [isConnected, setIsConnected] = useState(false);
  const [images, setImages] = useState<CloudImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [publishMode, setPublishMode] = useState<"single" | "daily" | "monthly">("single");
  const [timeOfDay, setTimeOfDay] = useState("09:00");
  const [selectedPage, setSelectedPage] = useState("");
  const [pages, setPages] = useState<any[]>([]);
  
  const API_BASE = getApiBaseUrl();

  // Load Meta pages
  useEffect(() => {
    if (!orgId) return;
    
    fetch(`${API_BASE}/api/orgs/${orgId}/meta/pages`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.pages) {
          setPages(data.pages);
        }
      })
      .catch(err => console.error("Feil ved lasting av sider:", err));
  }, [orgId]);

  const handleConnectDropbox = async () => {
    if (!orgId) return;
    
    // Open Dropbox OAuth in new window
    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${API_BASE}/api/marketing/cloud/callback/dropbox`)}&response_type=code&state=${orgId}`;
    window.open(authUrl, '_blank', 'width=600,height=700');
    
    // Poll for connection status
    const checkInterval = setInterval(async () => {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/social/cloud-images?provider=dropbox`, {
        credentials: "include"
      });
      
      if (res.ok) {
        setIsConnected(true);
        clearInterval(checkInterval);
        toast.success("Dropbox tilkoblet!");
        loadImages();
      }
    }, 2000);
    
    // Stop checking after 2 minutes
    setTimeout(() => clearInterval(checkInterval), 120000);
  };

  const loadImages = async () => {
    if (!orgId) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/social/cloud-images?provider=dropbox`, {
        credentials: "include"
      });
      
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
        setIsConnected(true);
      }
    } catch (err) {
      console.error("Feil ved lasting av bilder:", err);
      toast.error("Kunne ikke laste bilder");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeImage = async (image: CloudImage) => {
    if (!orgId) return;
    
    setIsLoading(true);
    try {
      // Get image URL (simplified - in production, need proper image serving)
      const imageUrl = `https://via.placeholder.com/400x300.png?text=${encodeURIComponent(image.name)}`;
      
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/social/analyze-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ imageUrl })
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // Update image with analysis
        setImages(prev => prev.map(img => 
          img.id === image.id 
            ? { ...img, aiAnalysis: data.analysis }
            : img
        ));
        
        toast.success("Bilde analysert!");
      }
    } catch (err) {
      console.error("Feil ved analyse:", err);
      toast.error("Kunne ikke analysere bilde");
    } finally {
      setIsLoading(false);
    }
  };

  const generateContent = async (image: CloudImage) => {
    if (!orgId || !image.aiAnalysis) return;
    
    setIsLoading(true);
    try {
      const imageUrl = `https://via.placeholder.com/400x300.png?text=${encodeURIComponent(image.name)}`;
      
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/social/generate-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          imageUrl,
          imageAnalysis: image.aiAnalysis,
          tone: "profesjonell og engasjerende",
          callToAction: "Kontakt oss i dag!"
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // Update image with generated content
        setImages(prev => prev.map(img => 
          img.id === image.id 
            ? { 
                ...img, 
                generatedContent: {
                  message: data.content,
                  hashtags: data.hashtags
                }
              }
            : img
        ));
        
        toast.success("Innhold generert!");
      }
    } catch (err) {
      console.error("Feil ved generering:", err);
      toast.error("Kunne ikke generere innhold");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishNow = async (image: CloudImage) => {
    if (!orgId || !selectedPage || !image.generatedContent) {
      toast.error("Velg en side og generer innhold først");
      return;
    }
    
    setIsLoading(true);
    try {
      const imageUrl = `https://via.placeholder.com/400x300.png?text=${encodeURIComponent(image.name)}`;
      
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/social/publish-now`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          pageId: selectedPage,
          imageUrl,
          message: image.generatedContent.message,
          hashtags: image.generatedContent.hashtags
        })
      });
      
      if (res.ok) {
        toast.success("Innlegg publisert! 🎉");
      } else {
        const error = await res.json();
        toast.error(error.error || "Kunne ikke publisere");
      }
    } catch (err) {
      console.error("Feil ved publisering:", err);
      toast.error("Kunne ikke publisere innlegg");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleAutomation = async () => {
    if (!orgId || !selectedPage || selectedImages.length === 0) {
      toast.error("Velg side og minst ett bilde");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/social/schedule-automation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          frequency: publishMode,
          timeOfDay,
          duration: publishMode === "monthly" ? 30 : publishMode === "daily" ? 7 : 1,
          pageId: selectedPage,
          cloudProvider: "dropbox",
          tone: "profesjonell",
          callToAction: "Kontakt oss!"
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        toast.success(`Automatisering opprettet! ID: ${data.automation.id}`);
      } else {
        const error = await res.json();
        toast.error(error.error || "Kunne ikke opprette automatisering");
      }
    } catch (err) {
      console.error("Feil ved automatisering:", err);
      toast.error("Kunne ikke opprette automatisering");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automatisk Publisering</h1>
          <p className="text-muted-foreground">
            Koble til din sky-lagring og la AI-en automatisk lage og publisere innlegg
          </p>
        </div>
        
        {!isConnected ? (
          <Button onClick={handleConnectDropbox} size="lg">
            <Droplet className="mr-2 h-5 w-5" />
            Koble til Dropbox
          </Button>
        ) : (
          <Badge variant="default" className="h-10 px-4">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Tilkoblet
          </Badge>
        )}
      </div>

      {isConnected && (
        <>
          {/* Publishing Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publiseringsinnstillinger</CardTitle>
              <CardDescription>
                Velg hvordan og når innleggene skal publiseres
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Facebook Side</Label>
                  <Select value={selectedPage} onValueChange={setSelectedPage}>
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

                <div>
                  <Label>Publiseringsmodus</Label>
                  <Select value={publishMode} onValueChange={(v: any) => setPublishMode(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Publiser én gang nå</SelectItem>
                      <SelectItem value="daily">Daglig i 7 dager</SelectItem>
                      <SelectItem value="monthly">Daglig i 30 dager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tidspunkt</Label>
                  <Input
                    type="time"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                  />
                </div>
              </div>

              {publishMode !== "single" && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Zap className="inline mr-2 h-4 w-4" />
                    <strong>Automatisk publisering aktivert!</strong> AI-en vil velge og publisere ett bilde hver dag kl. {timeOfDay}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <Image className="h-16 w-16 text-gray-400" />
                  <div className="absolute top-2 right-2">
                    <Badge variant={image.aiAnalysis ? "default" : "secondary"}>
                      {image.aiAnalysis ? `Score: ${image.aiAnalysis.score || 7}/10` : "Ikke analysert"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm truncate">{image.name}</h3>

                  {image.aiAnalysis && (
                    <div className="text-xs text-muted-foreground">
                      <p className="line-clamp-2">{image.aiAnalysis.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {image.aiAnalysis.keywords?.slice(0, 3).map((keyword, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {image.generatedContent && (
                    <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                      <p className="line-clamp-3">{image.generatedContent.message}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {image.generatedContent.hashtags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-blue-600">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!image.aiAnalysis && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => analyzeImage(image)}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Analyser
                      </Button>
                    )}

                    {image.aiAnalysis && !image.generatedContent && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateContent(image)}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        <Zap className="mr-1 h-3 w-3" />
                        Generer
                      </Button>
                    )}

                    {image.generatedContent && (
                      <Button
                        size="sm"
                        onClick={() => handlePublishNow(image)}
                        disabled={isLoading || !selectedPage}
                        className="flex-1"
                      >
                        <Upload className="mr-1 h-3 w-3" />
                        Publiser
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {images.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Image className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ingen bilder funnet</h3>
                <p className="text-muted-foreground mb-4">
                  Last opp bilder til mappen "LyxSo Marketing" i Dropbox
                </p>
                <Button onClick={loadImages} variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Oppdater
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
