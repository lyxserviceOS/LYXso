"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Facebook, CheckCircle2, XCircle, RefreshCw, ExternalLink } from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiConfig";

interface MetaConnection {
  isConnected: boolean;
  userName?: string;
  userId?: string;
  connectedAt?: string;
}

interface FacebookPage {
  id: string;
  name: string;
  category?: string;
  access_token?: string;
}

export default function MetaConnectPage() {
  const router = useRouter();
  const [orgId, setOrgId] = useState<string>("");
  const API_BASE = getApiBaseUrl();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [connection, setConnection] = useState<MetaConnection | null>(null);
  const [pages, setPages] = useState<FacebookPage[]>([]);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const orgIdFromPath = pathSegments[2];
    setOrgId(orgIdFromPath || "");
    
    if (orgIdFromPath) {
      loadConnectionStatus();
    }
  }, []);

  const loadConnectionStatus = async () => {
    setLoading(true);
    try {
      // Sjekk tilkobling
      const connRes = await fetch(`${API_BASE}/api/orgs/${orgId}/marketing/meta/connection`);
      if (connRes.ok) {
        const data = await connRes.json();
        setConnection(data);

        // Hvis tilkoblet, hent sider
        if (data.isConnected) {
          loadPages();
        }
      }
    } catch (err) {
      console.error("Feil ved lasting av tilkobling:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/marketing/meta/pages`);
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
      }
    } catch (err) {
      console.error("Feil ved lasting av sider:", err);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    toast.info("Omdirigerer til Facebook...");

    try {
      // Redirect til Meta OAuth
      window.location.href = `${API_BASE}/api/orgs/${orgId}/marketing/meta/auth`;
    } catch (err) {
      console.error("Feil ved tilkobling:", err);
      toast.error("Kunne ikke koble til Facebook");
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Er du sikker på at du vil koble fra Facebook?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/marketing/meta/disconnect`, {
        method: 'POST',
      });

      if (res.ok) {
        toast.success("Koblet fra Facebook");
        setConnection({ isConnected: false });
        setPages([]);
      } else {
        toast.error("Kunne ikke koble fra");
      }
    } catch (err) {
      console.error("Feil ved frakobling:", err);
      toast.error("Uventet feil");
    }
  };

  const handleRefresh = () => {
    loadConnectionStatus();
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Facebook className="h-8 w-8" />
          Facebook Tilkobling
        </h1>
        <p className="text-muted-foreground">
          Koble til Facebook for å publisere innlegg til dine sider
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Tilkoblingsstatus
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Status for din Facebook-tilkobling
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connection?.isConnected ? (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription className="ml-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Tilkoblet til Facebook</p>
                        {connection.userName && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Bruker: {connection.userName}
                          </p>
                        )}
                        {connection.connectedAt && (
                          <p className="text-sm text-muted-foreground">
                            Tilkoblet: {new Date(connection.connectedAt).toLocaleDateString('nb-NO')}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" onClick={handleDisconnect}>
                        Koble fra
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  <AlertDescription className="ml-2">
                    Ikke tilkoblet til Facebook
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleConnect} 
                  disabled={connecting}
                  className="w-full"
                  size="lg"
                >
                  {connecting ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Kobler til...
                    </>
                  ) : (
                    <>
                      <Facebook className="mr-2 h-5 w-5" />
                      Koble til Facebook
                    </>
                  )}
                </Button>

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Hva skjer når du kobler til?</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Du vil bli omdirigert til Facebook for å godkjenne tilgang
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Vi får tilgang til å publisere innlegg på dine vegne
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Du kan når som helst koble fra tilgangen
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {connection?.isConnected && pages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tilkoblede Facebook-sider</CardTitle>
              <CardDescription>
                Sider du kan publisere til ({pages.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div>
                      <h4 className="font-medium">{page.name}</h4>
                      {page.category && (
                        <p className="text-sm text-muted-foreground">{page.category}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">ID: {page.id}</p>
                    </div>
                    <Badge variant="secondary">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Aktiv
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={() => router.push(`/${orgId}/marketing/meta/publish`)}
                  className="flex-1"
                >
                  Publiser innlegg
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => router.push(`/${orgId}/marketing/meta/posts`)}
                  variant="outline"
                  className="flex-1"
                >
                  Se publiserte innlegg
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {connection?.isConnected && pages.length === 0 && (
          <Alert>
            <AlertDescription>
              Ingen Facebook-sider funnet. Sørg for at du har administrasjonstilgang til minst én Facebook-side.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
