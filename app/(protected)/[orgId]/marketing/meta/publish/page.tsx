"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  Facebook, 
  Send, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Calendar,
  RefreshCw,
  ArrowLeft,
  AlertCircle
} from "lucide-react";

interface FacebookPage {
  id: string;
  name: string;
  category?: string;
}

export default function MetaPublishPage() {
  const router = useRouter();
  const [orgId, setOrgId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  
  // Form state
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [scheduled, setScheduled] = useState("");
  const [useSchedule, setUseSchedule] = useState(false);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const orgIdFromPath = pathSegments[2];
    setOrgId(orgIdFromPath || "");
    
    if (orgIdFromPath) {
      loadPages();
    }
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/orgs/${orgId}/marketing/meta/pages`);
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
        
        if (data.pages && data.pages.length > 0) {
          setSelectedPageId(data.pages[0].id);
        }
      } else {
        toast.error("Kunne ikke hente Facebook-sider");
      }
    } catch (err) {
      console.error("Feil ved lasting av sider:", err);
      toast.error("Feil ved lasting av sider");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedPageId || !message.trim()) {
      toast.error("Velg en side og skriv en melding");
      return;
    }

    setPublishing(true);

    try {
      const body: any = {
        pageId: selectedPageId,
        message: message.trim(),
      };

      if (imageUrl.trim()) {
        body.imageUrl = imageUrl.trim();
      }

      if (linkUrl.trim()) {
        body.linkUrl = linkUrl.trim();
      }

      if (useSchedule && scheduled) {
        body.scheduled = new Date(scheduled).toISOString();
      }

      const res = await fetch(`http://localhost:4000/api/orgs/${orgId}/marketing/meta/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || "Innlegg publisert!");
        
        // Reset form
        setMessage("");
        setImageUrl("");
        setLinkUrl("");
        setScheduled("");
        setUseSchedule(false);

        // Redirect to posts list
        setTimeout(() => {
          router.push(`/${orgId}/marketing/meta/posts`);
        }, 1500);
      } else {
        const error = await res.json();
        toast.error(error.error || "Kunne ikke publisere");
      }
    } catch (err) {
      console.error("Feil ved publisering:", err);
      toast.error("Uventet feil ved publisering");
    } finally {
      setPublishing(false);
    }
  };

  const handleConnectRedirect = () => {
    router.push(`/${orgId}/marketing/meta/connect`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-orange-500" />
              Ingen Facebook-sider tilkoblet
            </CardTitle>
            <CardDescription>
              Du må koble til Facebook først for å publisere innlegg
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleConnectRedirect} className="w-full" size="lg">
              <Facebook className="mr-2 h-5 w-5" />
              Koble til Facebook
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tilbake
        </Button>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Send className="h-8 w-8" />
          Publiser til Facebook
        </h1>
        <p className="text-muted-foreground">
          Lag og publiser innlegg til dine Facebook-sider
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nytt innlegg</CardTitle>
            <CardDescription>
              Fyll ut skjemaet og publiser til Facebook
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Facebook side */}
            <div className="space-y-2">
              <Label htmlFor="page">
                <Facebook className="inline-block mr-2 h-4 w-4" />
                Facebook-side *
              </Label>
              <Select value={selectedPageId} onValueChange={setSelectedPageId}>
                <SelectTrigger id="page">
                  <SelectValue placeholder="Velg en side" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Melding *
              </Label>
              <Textarea
                id="message"
                placeholder="Skriv innlegget ditt her..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                {message.length} tegn
              </p>
            </div>

            {/* Image URL (optional) */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">
                <ImageIcon className="inline-block mr-2 h-4 w-4" />
                Bilde-URL (valgfritt)
              </Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                URL til et bilde som skal vises i innlegget
              </p>
            </div>

            {/* Link URL (optional) */}
            <div className="space-y-2">
              <Label htmlFor="linkUrl">
                <LinkIcon className="inline-block mr-2 h-4 w-4" />
                Lenke (valgfritt)
              </Label>
              <Input
                id="linkUrl"
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Legg til en lenke i innlegget
              </p>
            </div>

            {/* Scheduling (optional) */}
            <div className="space-y-3 border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="schedule" className="text-base">
                    <Calendar className="inline-block mr-2 h-4 w-4" />
                    Planlegg publisering
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Publiser automatisk på et senere tidspunkt
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="schedule"
                  checked={useSchedule}
                  onChange={(e) => setUseSchedule(e.target.checked)}
                  className="h-4 w-4"
                />
              </div>

              {useSchedule && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledTime">Tidspunkt</Label>
                  <Input
                    id="scheduledTime"
                    type="datetime-local"
                    value={scheduled}
                    onChange={(e) => setScheduled(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}
            </div>

            {/* Preview */}
            {message && (
              <div className="border-t pt-6">
                <Label className="text-base mb-3 block">Forhåndsvisning</Label>
                <div className="border rounded-lg p-4 bg-muted">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Facebook className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {pages.find(p => p.id === selectedPageId)?.name || "Facebook Side"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {useSchedule && scheduled 
                          ? `Publiseres ${new Date(scheduled).toLocaleString('nb-NO')}`
                          : 'Publiseres nå'
                        }
                      </p>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap">{message}</p>
                  {imageUrl && (
                    <div className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Med bilde
                    </div>
                  )}
                  {linkUrl && (
                    <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      {linkUrl}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handlePublish}
                disabled={publishing || !message.trim() || !selectedPageId}
                className="flex-1"
                size="lg"
              >
                {publishing ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Publiserer...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    {useSchedule ? 'Planlegg innlegg' : 'Publiser nå'}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setMessage("");
                  setImageUrl("");
                  setLinkUrl("");
                  setScheduled("");
                  setUseSchedule(false);
                }}
                disabled={publishing}
              >
                Nullstill
              </Button>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription>
            <strong>Tips:</strong> Innlegg med bilder får vanligvis mer engasjement. 
            Sørg for at bildet er relevant for innholdet.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
