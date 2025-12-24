"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Facebook, 
  RefreshCw,
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  Link as LinkIcon,
  Clock,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiConfig";

interface Post {
  id: string;
  platform_post_id: string;
  page_id: string;
  message: string;
  image_url?: string;
  link_url?: string;
  status: 'published' | 'scheduled' | 'failed';
  published_at?: string;
  scheduled_at?: string;
  created_at: string;
}

interface FacebookPage {
  id: string;
  name: string;
}

export default function MetaPostsPage() {
  const router = useRouter();
  const [orgId, setOrgId] = useState<string>("");
  const API_BASE = getApiBaseUrl();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const orgIdFromPath = pathSegments[2];
    setOrgId(orgIdFromPath || "");
    
    if (orgIdFromPath) {
      loadPages();
      loadPosts();
    }
  }, []);

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

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/marketing/meta/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      } else {
        toast.error("Kunne ikke hente innlegg");
      }
    } catch (err) {
      console.error("Feil ved lasting av innlegg:", err);
      toast.error("Feil ved lasting av innlegg");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadPosts();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Publisert</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" /> Planlagt</Badge>;
      case 'failed':
        return <Badge variant="destructive">Feilet</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPageName = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    return page?.name || pageId;
  };

  const filteredPosts = posts.filter(post => {
    // Filter by page
    if (selectedPageId !== "all" && post.page_id !== selectedPageId) {
      return false;
    }

    // Filter by status
    if (filterStatus !== "all" && post.status !== filterStatus) {
      return false;
    }

    // Filter by search query
    if (searchQuery && !post.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tilbake
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Facebook className="h-8 w-8" />
              Publiserte innlegg
            </h1>
            <p className="text-muted-foreground">
              Se og administrer dine Facebook-innlegg
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Oppdater
            </Button>
            <Button onClick={() => router.push(`/${orgId}/marketing/meta/publish`)}>
              Nytt innlegg
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Søk</label>
              <Input
                placeholder="Søk i innlegg..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Facebook-side</label>
              <Select value={selectedPageId} onValueChange={setSelectedPageId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle sider</SelectItem>
                  {pages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statuser</SelectItem>
                  <SelectItem value="published">Publisert</SelectItem>
                  <SelectItem value="scheduled">Planlagt</SelectItem>
                  <SelectItem value="failed">Feilet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Facebook className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ingen innlegg funnet</h3>
            <p className="text-muted-foreground mb-4">
              {posts.length === 0 
                ? "Du har ikke publisert noen innlegg ennå"
                : "Ingen innlegg matcher søkekriteriene dine"
              }
            </p>
            {posts.length === 0 && (
              <Button onClick={() => router.push(`/${orgId}/marketing/meta/publish`)}>
                Publiser ditt første innlegg
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Viser {filteredPosts.length} av {posts.length} innlegg
          </div>

          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Facebook className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold">{getPageName(post.page_id)}</span>
                      {getStatusBadge(post.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {post.published_at && (
                        <>
                          <Calendar className="inline-block h-3 w-3 mr-1" />
                          Publisert: {new Date(post.published_at).toLocaleString('nb-NO')}
                        </>
                      )}
                      {post.scheduled_at && !post.published_at && (
                        <>
                          <Clock className="inline-block h-3 w-3 mr-1" />
                          Planlagt: {new Date(post.scheduled_at).toLocaleString('nb-NO')}
                        </>
                      )}
                    </p>
                  </div>
                  {post.platform_post_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <a 
                        href={`https://facebook.com/${post.platform_post_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap mb-4">{post.message}</p>
                
                <div className="flex flex-wrap gap-2">
                  {post.image_url && (
                    <Badge variant="outline">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      Med bilde
                    </Badge>
                  )}
                  {post.link_url && (
                    <Badge variant="outline">
                      <LinkIcon className="h-3 w-3 mr-1" />
                      Med lenke
                    </Badge>
                  )}
                </div>

                {post.link_url && (
                  <a 
                    href={post.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-2 block"
                  >
                    {post.link_url}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
