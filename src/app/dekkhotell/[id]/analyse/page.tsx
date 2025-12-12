'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Upload,
  Camera,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  X,
  Eye,
  Calendar
} from 'lucide-react';

export default function TyreAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const tyreSetId = params.id as string;
  
  const [tyreSet, setTyreSet] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const orgId = process.env.NEXT_PUBLIC_ORG_ID || 'demo-org';

  useEffect(() => {
    if (tyreSetId) {
      loadTyreSet();
    }
  }, [tyreSetId]);

  async function loadTyreSet() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orgs/${orgId}/tyre-sets/${tyreSetId}`);
      const data = await res.json();
      
      if (data.tyreSet) {
        setTyreSet(data.tyreSet);
      }
    } catch (error) {
      console.error('Feil ved lasting av dekksett:', error);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('tyreSetId', tyreSetId);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orgs/${orgId}/tyres/upload`, {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      setPhotos([...photos, ...uploadedUrls]);
    } catch (err: any) {
      setError(err.message || 'Feil ved opplasting');
    } finally {
      setUploading(false);
    }
  }

  async function startAnalysis() {
    if (photos.length === 0) {
      setError('Du må laste opp minst ett bilde');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orgs/${orgId}/tyres/${tyreSetId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photos })
      });

      const data = await res.json();

      if (data.success && data.result) {
        setAnalysisResult(data.result);
      } else {
        throw new Error(data.error || 'Analyse feilet');
      }
    } catch (err: any) {
      setError(err.message || 'Feil ved AI-analyse');
    } finally {
      setAnalyzing(false);
    }
  }

  function removePhoto(index: number) {
    setPhotos(photos.filter((_, i) => i !== index));
  }

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'ok':
        return <Badge className="bg-green-500 text-lg px-4 py-2"><CheckCircle className="w-5 h-5 mr-2" />God tilstand</Badge>;
      case 'bør_byttes_snart':
        return <Badge className="bg-yellow-500 text-lg px-4 py-2"><Clock className="w-5 h-5 mr-2" />Bør byttes snart</Badge>;
      case 'må_byttes':
        return <Badge className="bg-red-500 text-lg px-4 py-2"><AlertCircle className="w-5 h-5 mr-2" />Må byttes</Badge>;
      default:
        return <Badge variant="outline">Ukjent</Badge>;
    }
  };

  const getWearBadge = (status: string) => {
    switch (status) {
      case 'ok':
        return <Badge className="bg-green-500">OK</Badge>;
      case 'warn':
        return <Badge className="bg-yellow-500">Advarsel</Badge>;
      case 'critical':
        return <Badge className="bg-red-500">Kritisk</Badge>;
      default:
        return <Badge variant="outline">Ukjent</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tilbake
          </Button>
          <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-500" />
            AI Dekk-analyse
          </h1>
          {tyreSet && (
            <p className="text-muted-foreground mt-1">
              {tyreSet.customers?.name} - {tyreSet.vehicles?.registration_number}
            </p>
          )}
        </div>
      </div>

      {!analysisResult ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>1. Last opp bilder</CardTitle>
              <CardDescription>
                Ta bilder av alle fire dekk. AI vil analysere mønsterdybde og tilstand.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Laster opp...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Velg bilder
                  </>
                )}
              </Button>

              {photos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{photos.length} bilder lastet opp</p>
                  <div className="grid grid-cols-2 gap-2">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Dekk ${index + 1}`}
                          className="rounded-md w-full h-32 object-cover"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-600 text-sm">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analyze Section */}
          <Card>
            <CardHeader>
              <CardTitle>2. Start AI-analyse</CardTitle>
              <CardDescription>
                AI vil analysere bildene og gi en detaljert tilstandsrapport
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={startAnalysis}
                disabled={photos.length === 0 || analyzing}
                className="w-full"
                size="lg"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyserer...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start AI-analyse
                  </>
                )}
              </Button>

              {analyzing && (
                <div className="space-y-2">
                  <Progress value={66} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    AI analyserer bildene dine...
                  </p>
                </div>
              )}

              <div className="bg-purple-50 border border-purple-200 rounded-md p-4 space-y-2">
                <h3 className="font-medium text-purple-900">AI analyserer:</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>✓ Mønsterdybde per dekk</li>
                  <li>✓ Slitasjemønster</li>
                  <li>✓ Generell tilstand</li>
                  <li>✓ Anbefaling for videre handling</li>
                  <li>✓ DOT-år (hvis synlig)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Analysis Results */
        <div className="space-y-6">
          {/* Overall Result */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Analyserapport</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Analyse fullført {new Date().toLocaleDateString('nb-NO')}
                  </CardDescription>
                </div>
                {getConditionBadge(analysisResult.overall_recommendation)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Vurdering:</h3>
                <p className="text-muted-foreground">{analysisResult.reasoning}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Anbefalt handling:</h3>
                <p className="text-muted-foreground">{analysisResult.recommended_action}</p>
              </div>

              {analysisResult.dot_year && (
                <div>
                  <h3 className="font-medium mb-2">DOT-år:</h3>
                  <Badge variant="outline">{analysisResult.dot_year}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Positions */}
          {analysisResult.positions && analysisResult.positions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dekkposisjoner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.positions.map((pos: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium capitalize">
                            {pos.position?.replace('_', ' ')}
                          </h4>
                          {getWearBadge(pos.wear_status)}
                        </div>

                        {pos.tread_depth_mm && (
                          <div>
                            <div className="text-sm text-muted-foreground">Mønsterdybde</div>
                            <div className="text-2xl font-bold">{pos.tread_depth_mm} mm</div>
                            <Progress 
                              value={(pos.tread_depth_mm / 8) * 100} 
                              className="mt-2"
                            />
                          </div>
                        )}

                        {pos.notes && (
                          <p className="text-sm text-muted-foreground">{pos.notes}</p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Neste steg</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button onClick={() => router.push(`/dekkhotell/${tyreSetId}`)}>
                <Eye className="w-4 h-4 mr-2" />
                Se detaljer
              </Button>
              {analysisResult.overall_recommendation === 'må_byttes' && (
                <Button variant="default">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book time
                </Button>
              )}
              <Button variant="outline" onClick={() => setAnalysisResult(null)}>
                Ny analyse
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
