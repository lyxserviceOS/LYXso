"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Cloud, 
  Image as ImageIcon, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Send,
  Sparkles,
  Facebook,
  Instagram,
  BarChart3,
  Settings,
  RefreshCw
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiConfig";

interface CloudConnection {
  provider: string;
  isConnected: boolean;
  connectedAt?: string;
}

interface CloudImage {
  id: string;
  name: string;
  path: string;
  provider: string;
  thumbnail?: string;
  modified?: string;
}

interface PostContent {
  message: string;
  hashtags: string[];
  imageAnalysis: any;
}

interface Analytics {
  posts: any[];
  bestPerforming: any[];
  recommendations: {
    bestTimeToPost: string;
    contentRecommendations: string[];
    hashtagSuggestions: string[];
  };
}

export default function SocialAutomationPage() {
  const [activeTab, setActiveTab] = useState("connect");
  const [orgId, setOrgId] = useState<string>("");
  const API_BASE = getApiBaseUrl();
  
  // Cloud storage state
  const [cloudProvider, setCloudProvider] = useState<string>("dropbox");
  const [cloudConnections, setCloudConnections] = useState<CloudConnection[]>([]);
  const [cloudImages, setCloudImages] = useState<CloudImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<CloudImage | null>(null);
  
  // Post generation state
  const [generatingPost, setGeneratingPost] = useState(false);
  const [postContent, setPostContent] = useState<PostContent | null>(null);
  const [tone, setTone] = useState("profesjonell og engasjerende");
  const [callToAction, setCallToAction] = useState("Kontakt oss i dag");
  
  // Publishing state
  const [publishing, setPublishing] = useState(false);
  const [pageId, setPageId] = useState("");
  
  // Automation state
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [frequency, setFrequency] = useState("daily");
  const [timeOfDay, setTimeOfDay] = useState("09:00");
  const [duration, setDuration] = useState(30);
  
  // Analytics state
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const orgIdFromPath = pathSegments[2];
    setOrgId(orgIdFromPath || "");
    
    if (orgIdFromPath) {
      loadCloudConnections();
    }
  }, []);

  const loadCloudConnections = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/social/cloud-images`);
      if (res.ok) {
        const data = await res.json();
        setCloudImages(data.images || []);
      }
    } catch (err) {
      console.error("Feil ved lasting av sky-bilder:", err);
    }
  };

  const handleConnectCloud = async () => {
    if (!cloudProvider) {
      toast.error("Velg en sky-leverandør");
      return;
    }

    toast.info(`Kobler til ${cloudProvider}...`);
    
    if (cloudProvider === 'dropbox') {
      window.location.href = `https://www.dropbox.com/oauth2/authorize?client_id=YOUR_DROPBOX_APP_KEY&redirect_uri=${window.location.origin}/api/orgs/${orgId}/social/dropbox/callback&response_type=code`;
    } else if (cloudProvider === 'google_drive') {
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=${window.location.origin}/api/orgs/${orgId}/social/google/callback&response_type=code&scope=https://www.googleapis.com/auth/drive.readonly`;
    }
  };

  const handleSelectImage = async (image: CloudImage) => {
    setSelectedImage(image);
    
    toast.info("Analyserer bilde med AI...");
    
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/social/analyze-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: image.path })
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Bilde analysert!");
      }
    } catch (err) {
      console.error("Feil ved analyse:", err);
    }
  };

  const handleGeneratePost = async () => {
    if (!selectedImage) {
      toast.error("Velg et bilde først");
      return;
    }

    setGeneratingPost(true);
    
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/social/generate-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: selectedImage.path,
          tone,
          callToAction
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPostContent(data);
        toast.success("Innlegg generert!");
        setActiveTab("publish");
      } else {
        toast.error("Kunne ikke generere innlegg");
      }
    } catch (err) {
      console.error("Feil ved generering:", err);
      toast.error("Uventet feil");
    } finally {
      setGeneratingPost(false);
    }
  };

  const handlePublishNow = async () => {
    if (!postContent || !pageId || !selectedImage) {
      toast.error("Mangler nødvendig informasjon");
      return;
    }

    setPublishing(true);

    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/social/publish-now`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId,
          imageUrl: selectedImage.path,
          message: postContent.message,
          hashtags: postContent.hashtags
        })
      });

      if (res.ok) {
        toast.success("Innlegg publisert!");
        setPostContent(null);
        setSelectedImage(null);
        setActiveTab("analytics");
        loadAnalytics();
      } else {
        const error = await res.json();
        toast.error(error.error || "Kunne ikke publisere");
      }
    } catch (err) {
      console.error("Feil ved publisering:", err);
      toast.error("Uventet feil");
    } finally {
      setPublishing(false);
    }
  };

  const handleSetupAutomation = async () => {
    if (!pageId) {
      toast.error("Velg en Facebook-side");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/social/schedule-automation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId,
          frequency,
          timeOfDay,
          duration,
          cloudProvider,
          tone,
          callToAction
        })
      });

      if (res.ok) {
        toast.success("Automatisering satt opp!");
        setAutomationEnabled(true);
      } else {
        toast.error("Kunne ikke sette opp automatisering");
      }
    } catch (err) {
      console.error("Feil ved automatisering:", err);
      toast.error("Uventet feil");
    }
  };

  const loadAnalytics = async () => {
    setLoadingAnalytics(true);
    
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/social/analytics?pageId=${pageId}`);
      
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error("Feil ved lasting av analyse:", err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Automatisk Sosial Media Posting
        </h1>
        <p className="text-muted-foreground">
          Koble til sky-lagring, la AI analysere bilder og generer engasjerende innlegg automatisk
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connect" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Sky-lagring
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generer
          </TabsTrigger>
          <TabsTrigger value="publish" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Publiser
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analyse
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Connect Cloud Storage */}
        <TabsContent value="connect" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Koble til Sky-lagring</CardTitle>
              <CardDescription>
                Gi tilgang til Dropbox eller Google Drive for å hente bilder automatisk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Velg sky-leverandør</Label>
                <Select value={cloudProvider} onValueChange={setCloudProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dropbox">Dropbox</SelectItem>
                    <SelectItem value="google_drive">Google Drive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleConnectCloud} className="w-full">
                <Cloud className="mr-2 h-4 w-4" />
                Koble til {cloudProvider === 'dropbox' ? 'Dropbox' : 'Google Drive'}
              </Button>

              {cloudImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Tilgjengelige bilder</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {cloudImages.map((image) => (
                      <div
                        key={image.id}
                        onClick={() => handleSelectImage(image)}
                        className={`cursor-pointer border-2 rounded-lg p-2 hover:border-primary transition ${
                          selectedImage?.id === image.id ? 'border-primary' : 'border-border'
                        }`}
                      >
                        {image.thumbnail ? (
                          <img 
                            src={image.thumbnail} 
                            alt={image.name}
                            className="w-full h-32 object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <p className="text-sm mt-2 truncate">{image.name}</p>
                        <Badge variant="outline" className="mt-1">
                          {image.provider}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Generate Post */}
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generer Innlegg med AI</CardTitle>
              <CardDescription>
                AI analyserer bildet og lager engasjerende tekst automatisk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedImage ? (
                <div className="border rounded-lg p-4 bg-muted">
                  <div className="flex items-start gap-4">
                    {selectedImage.thumbnail ? (
                      <img 
                        src={selectedImage.thumbnail} 
                        alt={selectedImage.name}
                        className="w-32 h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-background rounded flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{selectedImage.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedImage.provider}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Velg et bilde fra sky-lagring først
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("connect")}
                  >
                    Gå til sky-lagring
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profesjonell og engasjerende">Profesjonell og engasjerende</SelectItem>
                    <SelectItem value="vennlig og avslappet">Vennlig og avslappet</SelectItem>
                    <SelectItem value="entusiastisk">Entusiastisk</SelectItem>
                    <SelectItem value="informativ">Informativ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Call-to-action</Label>
                <Input
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  placeholder="Kontakt oss i dag"
                />
              </div>

              <Button 
                onClick={handleGeneratePost}
                disabled={!selectedImage || generatingPost}
                className="w-full"
              >
                {generatingPost ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Genererer...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generer innlegg med AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Publish */}
        <TabsContent value="publish" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publiser Innlegg</CardTitle>
              <CardDescription>
                Publiser nå eller sett opp automatisk publisering
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {postContent ? (
                <>
                  <div className="border rounded-lg p-4 bg-muted space-y-3">
                    <Label>Generert innlegg:</Label>
                    <Textarea 
                      value={postContent.message}
                      onChange={(e) => setPostContent({...postContent, message: e.target.value})}
                      rows={6}
                      className="font-normal"
                    />
                    <div className="flex flex-wrap gap-2">
                      {postContent.hashtags.map((tag, i) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Facebook Side-ID</Label>
                    <Input
                      value={pageId}
                      onChange={(e) => setPageId(e.target.value)}
                      placeholder="123456789"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handlePublishNow}
                      disabled={publishing || !pageId}
                      className="flex-1"
                    >
                      {publishing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Publiserer...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Publiser nå
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Send className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Generer et innlegg først
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("generate")}
                  >
                    Gå til generering
                  </Button>
                </div>
              )}

              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Automatisk Publisering
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Aktiver automatisering</Label>
                      <p className="text-sm text-muted-foreground">
                        Publiser automatisk hver dag
                      </p>
                    </div>
                    <Switch 
                      checked={automationEnabled}
                      onCheckedChange={setAutomationEnabled}
                    />
                  </div>

                  {automationEnabled && (
                    <>
                      <div className="space-y-2">
                        <Label>Frekvens</Label>
                        <Select value={frequency} onValueChange={setFrequency}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daglig</SelectItem>
                            <SelectItem value="weekly">Ukentlig</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Tidspunkt</Label>
                        <Input
                          type="time"
                          value={timeOfDay}
                          onChange={(e) => setTimeOfDay(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Varighet (dager)</Label>
                        <Input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(parseInt(e.target.value))}
                          min={1}
                          max={365}
                        />
                      </div>

                      <Button onClick={handleSetupAutomation} className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        Sett opp automatisering
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Analyse og Innsikt
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={loadAnalytics}
                  disabled={loadingAnalytics}
                >
                  {loadingAnalytics ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
              <CardDescription>
                AI-drevne anbefalinger basert på innleggsstatistikk
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Totalt innlegg
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {analytics.posts.length}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Beste tid å poste
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {analytics.recommendations.bestTimeToPost}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Engagement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          {Math.round(analytics.posts.reduce((acc, p) => 
                            acc + (p.insights?.engagedUsers || 0), 0) / analytics.posts.length)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {analytics.recommendations && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">AI-anbefalinger</h3>
                      
                      <div>
                        <Label className="text-sm">Innholdsanbefalinger</Label>
                        <ul className="mt-2 space-y-1">
                          {analytics.recommendations.contentRecommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <Label className="text-sm">Foreslåtte hashtags</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {analytics.recommendations.hashtagSuggestions.map((tag, i) => (
                            <Badge key={i} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {analytics.bestPerforming.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Best presterende innlegg</h3>
                      <div className="space-y-3">
                        {analytics.bestPerforming.slice(0, 3).map((post, i) => (
                          <div key={i} className="border rounded-lg p-3">
                            <p className="text-sm line-clamp-2">{post.message}</p>
                            {post.insights && (
                              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                <span>{post.insights.impressions} visninger</span>
                                <span>{post.insights.engagedUsers} engasjement</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Last analyse for å se statistikk
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={loadAnalytics}
                  >
                    Last analyse
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
