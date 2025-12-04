"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  Save, 
  Sparkles,
  Layout,
  Type,
  Image as ImageIcon,
  Users,
  Phone,
  Star,
  DollarSign,
  CheckCircle2,
  Globe,
  Settings
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE = getApiBaseUrl();
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

// Types
type SectionType = 
  | "hero" 
  | "services" 
  | "features" 
  | "testimonials" 
  | "contact" 
  | "pricing"
  | "gallery"
  | "cta"
  | "stats";

type Section = {
  id: string;
  type: SectionType;
  data: any;
};

type LandingPageConfig = {
  sections: Section[];
  settings: {
    primary_color: string;
    secondary_color: string;
    font_family: string;
    is_published: boolean;
  };
};

// Section Templates with defaults
const SECTION_TEMPLATES: Record<SectionType, { 
  name: string; 
  icon: any; 
  defaultData: any;
  description: string;
}> = {
  hero: {
    name: "Hero Section",
    icon: Layout,
    description: "Stor header med tittel, undertittel og CTA",
    defaultData: {
      title: "Velkommen til vår bedrift",
      subtitle: "Vi leverer profesjonelle tjenester med fokus på kvalitet",
      background_image: "",
      cta_text: "Bestill nå",
      cta_link: "/bestill",
      height: "large"
    }
  },
  services: {
    name: "Tjenester",
    icon: Sparkles,
    description: "Vis frem dine tjenester i et grid",
    defaultData: {
      title: "Våre tjenester",
      subtitle: "Alt du trenger på ett sted",
      services: [
        { title: "Tjeneste 1", description: "Beskrivelse", icon: "✨", price: "Fra 500 kr" },
        { title: "Tjeneste 2", description: "Beskrivelse", icon: "🚗", price: "Fra 800 kr" },
        { title: "Tjeneste 3", description: "Beskrivelse", icon: "💎", price: "Fra 1200 kr" }
      ],
      columns: 3
    }
  },
  features: {
    name: "Features / USP",
    icon: CheckCircle2,
    description: "Vis frem unike selgepunkter",
    defaultData: {
      title: "Hvorfor velge oss?",
      features: [
        { icon: "⚡", title: "Raskt", description: "Rask service uten kompromiss på kvalitet" },
        { icon: "💯", title: "Kvalitet", description: "Vi bruker kun de beste produktene" },
        { icon: "🎯", title: "Erfaring", description: "Over 10 års erfaring" }
      ],
      layout: "grid"
    }
  },
  testimonials: {
    name: "Testimonials",
    icon: Star,
    description: "Kundeomtaler og anmeldelser",
    defaultData: {
      title: "Hva kundene sier",
      testimonials: [
        { 
          name: "Ola Nordmann", 
          role: "Kunde", 
          text: "Fantastisk service! Anbefales på det sterkeste.", 
          rating: 5,
          image: ""
        }
      ],
      show_ratings: true
    }
  },
  contact: {
    name: "Kontakt",
    icon: Phone,
    description: "Kontaktinformasjon og kart",
    defaultData: {
      title: "Kontakt oss",
      subtitle: "Vi er her for å hjelpe deg",
      phone: "+47 123 45 678",
      email: "post@eksempel.no",
      address: "Gateadresse 1, 0123 Oslo",
      show_map: true,
      show_form: true
    }
  },
  pricing: {
    name: "Prising",
    icon: DollarSign,
    description: "Vis priser og pakker",
    defaultData: {
      title: "Priser",
      subtitle: "Velg pakken som passer deg",
      plans: [
        { 
          name: "Basis", 
          price: "499", 
          period: "per mnd",
          features: ["Feature 1", "Feature 2"],
          highlighted: false
        }
      ]
    }
  },
  gallery: {
    name: "Galleri",
    icon: ImageIcon,
    description: "Bildegalleri",
    defaultData: {
      title: "Galleri",
      images: [],
      columns: 4,
      show_lightbox: true
    }
  },
  cta: {
    name: "Call to Action",
    icon: Sparkles,
    description: "Oppfordring til handling",
    defaultData: {
      title: "Klar til å komme i gang?",
      subtitle: "Bestill time i dag og opplev forskjellen",
      button_text: "Bestill nå",
      button_link: "/bestill",
      background_color: "#3B82F6"
    }
  },
  stats: {
    name: "Statistikk",
    icon: Users,
    description: "Vis tall og statistikk",
    defaultData: {
      title: "Vi er stolte av",
      stats: [
        { number: "1000+", label: "Fornøyde kunder" },
        { number: "50+", label: "Ansatte" }
      ]
    }
  }
};

export default function LandingPageBuilderClient() {
  const [config, setConfig] = useState<LandingPageConfig>({
    sections: [],
    settings: {
      primary_color: "#3B82F6",
      secondary_color: "#10B981",
      font_family: "Inter",
      is_published: false
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    if (!ORG_ID || !API_BASE) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/landing-page`);
      const data = await res.json();
      
      if (data.landing_page?.sections_json) {
        setConfig({
          sections: data.landing_page.sections_json,
          settings: {
            primary_color: data.landing_page.primary_color || "#3B82F6",
            secondary_color: data.landing_page.secondary_color || "#10B981",
            font_family: data.landing_page.font_family || "Inter",
            is_published: data.landing_page.is_published || false
          }
        });
      }
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!ORG_ID || !API_BASE) return;
    
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/landing-page`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections_json: config.sections,
          primary_color: config.settings.primary_color,
          secondary_color: config.settings.secondary_color,
          font_family: config.settings.font_family,
          is_published: config.settings.is_published
        })
      });
      
      if (res.ok) {
        alert("✅ Lagret!");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Feil");
    } finally {
      setSaving(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(config.sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setConfig({ ...config, sections: items });
  };

  const addSection = (type: SectionType) => {
    const template = SECTION_TEMPLATES[type];
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type,
      data: { ...template.defaultData }
    };
    
    setConfig({
      ...config,
      sections: [...config.sections, newSection]
    });
    
    setSelectedSection(newSection.id);
  };

  const removeSection = (id: string) => {
    if (!confirm("Slette denne seksjonen?")) return;
    setConfig({
      ...config,
      sections: config.sections.filter(s => s.id !== id)
    });
    if (selectedSection === id) setSelectedSection(null);
  };

  const updateSection = (id: string, data: any) => {
    setConfig({
      ...config,
      sections: config.sections.map(s => 
        s.id === id ? { ...s, data } : s
      )
    });
  };

  const publish = async () => {
    if (!confirm("Publiser landing page? Den blir synlig for alle.")) return;
    
    const newConfig = {
      ...config,
      settings: { ...config.settings, is_published: true }
    };
    setConfig(newConfig);
    
    await saveConfig();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="min-h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 bg-slate-900 text-white px-4 py-3 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <span>Forhåndsvisning</span>
          </div>
          <button
            onClick={() => setPreviewMode(false)}
            className="px-4 py-2 bg-white text-slate-900 rounded-lg"
          >
            Tilbake til editor
          </button>
        </div>
        
        <div className="pt-16">
          <PreviewRenderer config={config} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Landing Page Builder</h1>
          {config.settings.is_published && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              Publisert
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(true)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
          >
            <Eye className="w-4 h-4" />
            Forhåndsvis
          </button>
          
          <button
            onClick={saveConfig}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            {saving ? "Lagrer..." : "Lagre"}
          </button>
          
          {!config.settings.is_published && (
            <button
              onClick={publish}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Globe className="w-4 h-4" />
              Publiser
            </button>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r h-[calc(100vh-60px)] overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">LEGG TIL SEKSJON</h2>
            
            <div className="space-y-2">
              {(Object.keys(SECTION_TEMPLATES) as SectionType[]).map((type) => {
                const template = SECTION_TEMPLATES[type];
                const Icon = template.icon;
                
                return (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="w-full flex items-start gap-3 p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 p-6 overflow-y-auto h-[calc(100vh-60px)]">
          <div className="max-w-4xl mx-auto">
            {config.sections.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed">
                <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Ingen seksjoner enda</h3>
                <p className="text-gray-600">Legg til din første seksjon fra biblioteket</p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {config.sections.map((section, index) => (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-white rounded-lg border-2 ${
                                selectedSection === section.id ? "border-blue-500" : "border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between p-4 border-b">
                                <div className="flex items-center gap-3">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="w-5 h-5 text-gray-400" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{SECTION_TEMPLATES[section.type].name}</div>
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => removeSection(section.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              
                              <div
                                className="p-4"
                                onClick={() => setSelectedSection(section.id)}
                              >
                                <SectionEditor
                                  section={section}
                                  onChange={(data: any) => updateSection(section.id, data)}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        {selectedSection && (
          <div className="w-80 bg-white border-l h-[calc(100vh-60px)] overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">INNSTILLINGER</h2>
              {(() => {
                const section = config.sections.find(s => s.id === selectedSection);
                if (!section) return null;
                
                return (
                  <SectionSettings
                    section={section}
                    onChange={(data: any) => updateSection(section.id, data)}
                  />
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionEditor({ section, onChange }: any) {
  const { type, data } = section;
  
  if (type === "hero") {
    return (
      <div className="space-y-3">
        <input
          type="text"
          value={data.title || ""}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Hero tittel"
          className="w-full px-3 py-2 border rounded-lg"
        />
        <textarea
          value={data.subtitle || ""}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
          placeholder="Hero undertittel"
          className="w-full px-3 py-2 border rounded-lg"
          rows={2}
        />
        <input
          type="text"
          value={data.cta_text || ""}
          onChange={(e) => onChange({ ...data, cta_text: e.target.value })}
          placeholder="CTA knapp tekst"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
    );
  }
  
  return (
    <div className="text-sm text-gray-600">
      Klikk for å redigere innstillinger →
    </div>
  );
}

function SectionSettings({ section, onChange }: any) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Avanserte innstillinger for {SECTION_TEMPLATES[section.type as SectionType]?.name}
      </div>
    </div>
  );
}

function PreviewRenderer({ config }: { config: LandingPageConfig }) {
  return (
    <div className="min-h-screen">
      {config.sections.map((section) => (
        <div key={section.id} className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionPreview section={section} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionPreview({ section }: { section: Section }) {
  const { type, data } = section;
  
  if (type === "hero") {
    return (
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">{data.title}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{data.subtitle}</p>
        {data.cta_text && (
          <button className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium">
            {data.cta_text}
          </button>
        )}
      </div>
    );
  }
  
  if (type === "services") {
    return (
      <div>
        <h2 className="text-3xl font-bold text-center mb-4">{data.title}</h2>
        {data.subtitle && <p className="text-gray-600 text-center mb-8">{data.subtitle}</p>}
        <div className="grid grid-cols-3 gap-6">
          {data.services?.map((service: any, idx: number) => (
            <div key={idx} className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">{service.icon}</div>
              <h3 className="font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{service.description}</p>
              {service.price && <p className="text-blue-600 font-medium">{service.price}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8 bg-gray-100 rounded-lg text-center">
      <p className="text-gray-600">Preview for {SECTION_TEMPLATES[type]?.name || type}</p>
    </div>
  );
}
