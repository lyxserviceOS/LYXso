"use client";

import TagManagement from "@/components/customers/TagManagement";
import GDPRManagement from "@/components/customers/GDPRManagement";

interface TagSectionProps {
  customerId: string;
}

interface GDPRSectionProps {
  customerId: string;
  customerEmail: string;
  consents: {
    marketing: boolean;
    data_processing: boolean;
    updated_at: string;
  };
}

/**
 * Client wrapper for TagManagement section
 * Handles tag selection state and updates
 */
export function TagSection({ customerId }: TagSectionProps) {
  const handleTagsChange = async (tagIds: string[]) => {
    console.log("Tags updated:", tagIds);
    // TODO: Implement tag assignment to customer if needed
    // For now, TagManagement component handles its own state
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <TagManagement
        customerId={customerId}
        selectedTags={[]}
        onTagsChange={handleTagsChange}
      />
    </section>
  );
}

/**
 * Client wrapper for GDPRManagement section
 * Handles consent updates and page revalidation
 */
export function GDPRSection({ customerId, customerEmail, consents }: GDPRSectionProps) {
  const handleConsentsUpdated = () => {
    // Reload page to refresh data after consent update
    window.location.reload();
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <GDPRManagement
        customerId={customerId}
        customerEmail={customerEmail}
        consents={consents}
        onConsentsUpdated={handleConsentsUpdated}
      />
    </section>
  );
}
