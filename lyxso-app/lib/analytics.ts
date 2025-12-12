// lib/analytics.ts
// Unified analytics tracking for LYXso

type EventProperties = Record<string, any>;

// Google Analytics 4
export const trackEvent = (eventName: string, properties?: EventProperties) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
};

// Facebook Pixel
export const trackFBEvent = (eventName: string, properties?: EventProperties) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, properties);
  }
};

// LinkedIn Insight Tag
export const trackLinkedInEvent = (conversionId?: string) => {
  if (typeof window !== 'undefined' && (window as any).lintrk) {
    if (conversionId) {
      (window as any).lintrk('track', { conversion_id: conversionId });
    } else {
      (window as any).lintrk('track', {});
    }
  }
};

// Combined tracking functions
export const analytics = {
  // Page view
  pageView: (pageName?: string) => {
    trackEvent('page_view', {
      page_title: pageName || document.title,
      page_location: window.location.href,
    });
    trackFBEvent('PageView');
  },

  // CTA clicks
  ctaClick: (buttonText: string, location: string) => {
    trackEvent('cta_click', {
      button_text: buttonText,
      button_location: location,
    });
    trackFBEvent('Lead', {
      content_name: `${buttonText} CTA`,
      value: 500,
      currency: 'NOK',
    });
  },

  // Demo booking
  demoBooked: (industry: string, plan?: string) => {
    trackEvent('demo_booked', {
      value: 500,
      currency: 'NOK',
      industry,
      plan,
    });
    trackFBEvent('CompleteRegistration', {
      content_name: 'Demo booked',
      value: 500,
      currency: 'NOK',
    });
    trackLinkedInEvent(process.env.NEXT_PUBLIC_LINKEDIN_DEMO_CONVERSION_ID);
  },

  // Registration (trial start)
  signUp: (method: string, plan: string) => {
    trackEvent('sign_up', {
      method,
      plan,
    });
    trackFBEvent('StartTrial', {
      predicted_ltv: 17988,
      currency: 'NOK',
    });
    trackLinkedInEvent(process.env.NEXT_PUBLIC_LINKEDIN_TRIAL_CONVERSION_ID);
  },

  // Purchase (subscription)
  purchase: (transactionId: string, value: number, plan: string) => {
    trackEvent('purchase', {
      transaction_id: transactionId,
      value,
      currency: 'NOK',
      items: [
        {
          item_name: plan,
          price: value,
          quantity: 1,
        },
      ],
    });
    trackFBEvent('Purchase', {
      value,
      currency: 'NOK',
      content_name: plan,
    });
  },

  // View pricing
  viewPricing: () => {
    trackEvent('view_pricing');
    trackFBEvent('ViewContent', {
      content_name: 'Pricing page',
    });
  },

  // Select plan
  selectPlan: (plan: string, price: number) => {
    trackEvent('select_plan', {
      plan,
      price,
      currency: 'NOK',
    });
    trackFBEvent('AddToCart', {
      content_name: plan,
      value: price,
      currency: 'NOK',
    });
  },

  // Video views
  videoView: (videoName: string, percentage: number) => {
    trackEvent('video_view', {
      video_name: videoName,
      percentage_watched: percentage,
    });
  },

  // Form starts
  formStart: (formName: string) => {
    trackEvent('form_start', {
      form_name: formName,
    });
  },

  // Form submissions
  formSubmit: (formName: string) => {
    trackEvent('form_submit', {
      form_name: formName,
    });
  },
};

// Export for use in components
export default analytics;
