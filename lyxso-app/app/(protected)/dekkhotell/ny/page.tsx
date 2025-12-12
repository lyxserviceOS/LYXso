"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Camera, Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { showToast } from "@/lib/toast";

// Step 1: Upload photos for AI analysis
// Step 2: AI analyzes and shows results
// Step 3: Customer search/create + fill in details
// Step 4: Storage location + final save

export default function NyttDekkhotellPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Step 1: Photo upload
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Step 2: AI analysis results
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);
  
  // Step 3: Customer & tyre details
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [customerVehicles, setCustomerVehicles] = useState<any[]>([]);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  
  const [tyreDetails, setTyreDetails] = useState({
    type: "",
    dimension: "",
    brand: "",
    dot_year: "",
    season: "",
    tread_depth_front: "",
    tread_depth_rear: "",
    notes: ""
  });
  
  // Step 4: Storage location
  const [storageLocation, setStorageLocation] = useState({
    row: "",
    shelf: "",
    position: ""
  });

  // Handle photo selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos([...photos, ...newFiles]);
    }
  };

  // Remove photo
  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  // Step 1 → AI + Customer: Analyze with AI immediately after photo upload
  const handleAnalyzeWithAI = async () => {
    if (photos.length === 0) {
      showToast.warning("Last opp minst 1 bilde");
      return;
    }

    setAiAnalyzing(true);
    
    try {
      // Upload photos first
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append(`photos`, photo);
      });

      // Call AI analysis endpoint
      const res = await fetch("/api/tyres/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("AI-analyse feilet");

      const result = await res.json();
      
      // Validate AI result structure
      if (!result || typeof result !== 'object') {
        throw new Error("Ugyldig AI-respons");
      }
      
      setAiResults(result);
      
      // ✅ IMMEDIATELY PRE-FILL tyre details from AI results
      setTyreDetails(prev => ({
        ...prev,
        season: result.season || prev.season,
        dimension: result.dimension || prev.dimension,
        brand: result.brand || prev.brand,
        dot_year: result.dot_year || prev.dot_year,
        tread_depth_front: result.tread_depth_front || prev.tread_depth_front,
        tread_depth_rear: result.tread_depth_rear || prev.tread_depth_rear,
        type: result.type || prev.type
      }));
      
      // ✅ SKIP step 2, go directly to customer + details (step 3)
      setCurrentStep(3);
      showToast.success("AI-analyse fullført!", {
        description: "Detaljer er forhåndsutfylt - fyll inn manglende info."
      });
    } catch (error) {
      console.error(error);
      showToast.error("Kunne ikke analysere bilder", {
        description: "Fortsett manuelt eller prøv igjen."
      });
      // Allow continuing without AI
      setCurrentStep(3);
    } finally {
      setAiAnalyzing(false);
    }
  };

  // ✅ Search customers from database with DEBOUNCE
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (customerSearchTerm.length >= 2) {
        performCustomerSearch(customerSearchTerm);
      } else {
        setCustomerSuggestions([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayTimer);
  }, [customerSearchTerm]);

  const performCustomerSearch = async (term: string) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_LYXSO_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

      if (!ORG_ID) {
        console.error("Mangler NEXT_PUBLIC_ORG_ID");
        return;
      }

      // ✅ Search by name, email, phone
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/customers/search?q=${encodeURIComponent(term)}`, {
        credentials: 'include'
      });
      
      if (!res.ok) {
        console.error("Søk feilet:", res.status);
        return;
      }
      
      const data = await res.json();
      
      // ✅ Show results with vehicles
      setCustomerSuggestions(data.customers || []);
    } catch (error) {
      console.error("Customer search error:", error);
      setCustomerSuggestions([]);
    }
  };

  // Select existing customer and fetch their vehicles
  const selectCustomer = async (customer: any) => {
    setSelectedCustomer(customer);
    setCustomerSearchTerm(customer.full_name || customer.name || `${customer.first_name} ${customer.last_name}`);
    setCustomerSuggestions([]);
    setShowNewCustomerForm(false);
    
    // Fetch customer's vehicles
    try {
      const API_BASE = process.env.NEXT_PUBLIC_LYXSO_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;
      
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/customers/${customer.id}/vehicles`, {
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        setCustomerVehicles(data.vehicles || []);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setCustomerVehicles([]);
    }
  };
  
  // Select vehicle
  const selectVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
  };

  // Step 2 → 3: Continue to customer details (NO LONGER USED - AI goes directly to step 3)
  const handleContinueToCustomer = () => {
    setCurrentStep(3);
  };

  // Step 3 → 4: Continue to storage
  const handleContinueToStorage = () => {
    if (!selectedCustomer && !showNewCustomerForm) {
      showToast.warning("Velg eller opprett en kunde");
      return;
    }
    setCurrentStep(4);
  };

  // Step 4: Save tyre set
  const handleSaveTyreSet = async () => {
    try {
      const payload = {
        customer_id: selectedCustomer?.id,
        customer_data: showNewCustomerForm ? {
          full_name: customerSearchTerm,
          // ... other fields
        } : null,
        tyre_details: tyreDetails,
        storage_location: storageLocation,
        photos: photos.map(p => p.name), // or upload URLs
        ai_results: aiResults
      };

      const res = await fetch("/api/tyres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Kunne ikke lagre dekksett");

      showToast.success("Dekksett lagret!", {
        description: "Du blir videresendt til oversikten."
      });
      router.push("/dekkhotell");
    } catch (error) {
      console.error(error);
      showToast.error("Feil ved lagring", {
        description: "Prøv igjen eller kontakt support."
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nytt dekksett</h1>
        <p className="text-sm text-gray-500 mt-1">
          Last opp bilder, AI analyserer, fyll inn detaljer og lagre
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep === step
                  ? "bg-blue-600 text-white"
                  : currentStep > step
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 4 && (
              <div className={`w-24 h-1 ${currentStep > step ? "bg-green-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Photo Upload */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">1. Last opp bilder av dekk</h2>
          <p className="text-sm text-gray-600">
            Last opp 4-8 bilder (alle hjul + ekstra vinkler). AI vil analysere tilstand, sesong, DOT osv.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Dekk ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                >
                  ×
                </button>
              </div>
            ))}

            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Last opp</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoSelect}
              />
            </label>
          </div>

          <button
            onClick={handleAnalyzeWithAI}
            disabled={aiAnalyzing || photos.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
          >
            {aiAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyserer med AI...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Analyser med AI
              </>
            )}
          </button>
        </div>
      )}

      {/* Step 2: AI Results */}
      {currentStep === 2 && aiResults && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">2. AI-analyse resultat</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Analyse fullført</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Sesong:</span>
                <p className="font-semibold">{aiResults.season || "Ukjent"}</p>
              </div>
              <div>
                <span className="text-gray-600">Dimensjon:</span>
                <p className="font-semibold">{aiResults.dimension || "Ukjent"}</p>
              </div>
              <div>
                <span className="text-gray-600">DOT-år:</span>
                <p className="font-semibold">{aiResults.dot_year || "Ukjent"}</p>
              </div>
              <div>
                <span className="text-gray-600">Mønsterdybde:</span>
                <p className="font-semibold">
                  F: {aiResults.tread_depth_front || "?"} mm / B: {aiResults.tread_depth_rear || "?"} mm
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Vurdering:</span>
                <p className="font-semibold text-green-700">{aiResults.recommendation || "OK tilstand"}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinueToCustomer}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            Fortsett til kundedetaljer
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 3: Customer & Tyre Details */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">3. Kunde og dekkdetaljer</h2>

          {/* Customer search */}
          <div>
            <label className="block text-sm font-medium mb-1">Søk kunde</label>
            <input
              type="text"
              value={customerSearchTerm}
              onChange={(e) => setCustomerSearchTerm(e.target.value)}
              placeholder="Søk på navn, e-post, telefon..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            
            {customerSuggestions.length > 0 && (
              <div className="mt-2 border rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto absolute z-10 w-full">
                {customerSuggestions.map((cust) => (
                  <button
                    key={cust.id}
                    onClick={() => selectCustomer(cust)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition"
                  >
                    <p className="font-semibold text-gray-900">{cust.full_name || cust.name}</p>
                    <p className="text-sm text-gray-600">{cust.email || '–'} • {cust.phone || '–'}</p>
                  </button>
                ))}
              </div>
            )}

            {!selectedCustomer && customerSearchTerm.length > 0 && customerSuggestions.length === 0 && (
              <button
                onClick={() => setShowNewCustomerForm(true)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                + Opprett ny kunde: {customerSearchTerm}
              </button>
            )}
          </div>

          {selectedCustomer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold text-blue-900">{selectedCustomer.full_name || selectedCustomer.name}</p>
              <p className="text-sm text-blue-700">{selectedCustomer.email} • {selectedCustomer.phone}</p>
            </div>
          )}
          
          {/* Vehicle selection */}
          {selectedCustomer && customerVehicles.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Velg kjøretøy</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customerVehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => selectVehicle(vehicle)}
                    className={`text-left p-4 border-2 rounded-lg transition ${
                      selectedVehicle?.id === vehicle.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{vehicle.registration_number}</p>
                    <p className="text-sm text-gray-600">{vehicle.make} {vehicle.model}</p>
                    {vehicle.year && <p className="text-xs text-gray-500">År: {vehicle.year}</p>}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {selectedCustomer && customerVehicles.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">Kunden har ingen registrerte kjøretøy. Du kan fortsatt lagre dekksett.</p>
            </div>
          )}

          {/* Tyre details (pre-filled by AI) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sesong</label>
              <select
                value={tyreDetails.season}
                onChange={(e) => setTyreDetails({...tyreDetails, season: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Velg</option>
                <option value="summer">Sommer</option>
                <option value="winter">Vinter</option>
                <option value="studded">Piggdekk</option>
                <option value="allseason">Helår</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Dimensjon</label>
              <input
                type="text"
                value={tyreDetails.dimension}
                onChange={(e) => setTyreDetails({...tyreDetails, dimension: e.target.value})}
                placeholder="205/55R16"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Merke</label>
              <input
                type="text"
                value={tyreDetails.brand}
                onChange={(e) => setTyreDetails({...tyreDetails, brand: e.target.value})}
                placeholder="Michelin, Continental..."
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">DOT-år</label>
              <input
                type="text"
                value={tyreDetails.dot_year}
                onChange={(e) => setTyreDetails({...tyreDetails, dot_year: e.target.value})}
                placeholder="2021"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <button
            onClick={handleContinueToStorage}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            Fortsett til lagerplassering
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 4: Storage Location */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">4. Lagerplassering</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rad</label>
              <input
                type="text"
                value={storageLocation.row}
                onChange={(e) => setStorageLocation({...storageLocation, row: e.target.value})}
                placeholder="A"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hylle</label>
              <input
                type="text"
                value={storageLocation.shelf}
                onChange={(e) => setStorageLocation({...storageLocation, shelf: e.target.value})}
                placeholder="3"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Plass</label>
              <input
                type="text"
                value={storageLocation.position}
                onChange={(e) => setStorageLocation({...storageLocation, position: e.target.value})}
                placeholder="12"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Oppsummering</p>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>Kunde: {selectedCustomer?.full_name || customerSearchTerm}</li>
              <li>Sesong: {tyreDetails.season || "–"}</li>
              <li>Dimensjon: {tyreDetails.dimension || "–"}</li>
              <li>DOT: {tyreDetails.dot_year || "–"}</li>
              <li>Plassering: {storageLocation.row}-{storageLocation.shelf}-{storageLocation.position}</li>
            </ul>
          </div>

          <button
            onClick={handleSaveTyreSet}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Lagre dekksett
          </button>
        </div>
      )}
    </div>
  );
}
