// config/adminFeatureToggles.ts
/**
 * Admin Feature Toggles & Nice-to-Have Configuration
 * 
 * This file centralizes all "nice to have" features and future enhancements
 * for easy management and activation when ready.
 * 
 * HOW TO USE:
 * 1. Set feature flags to true/false to enable/disable features
 * 2. Adjust settings for each feature
 * 3. Import this config in your admin components
 * 
 * Last Updated: December 6, 2024
 */

// ============================================================================
// FEATURE FLAGS - Enable/Disable Features
// ============================================================================

export const ADMIN_FEATURE_FLAGS = {
  // === AI FEATURES ===
  aiBooking: false,                    // AI-drevet booking-forslag
  aiCapacity: false,                   // AI kapasitets-optimalisering
  aiMultimodal: false,                 // Bildegenerering med DALL-E
  aiAutomation: false,                 // Auto-kampanjer og auto-svar
  aiMultiLanguage: false,              // Svensk, Dansk, Engelsk støtte
  aiSeasonalCampaigns: false,          // Auto-generer sesong-kampanjer
  aiPredictiveBooking: false,          // Prediktiv booking basert på historikk
  aiSentimentAnalysis: false,          // Kundesentiment-analyse
  
  // === ADVANCED MODULES ===
  multiLocation: false,                // Multi-lokasjon for større partnere
  ceoView: false,                      // CEO dashboard med KPIer
  whiteLabel: false,                   // Full white-label kundeportal
  advancedAutomation: false,           // Avansert automatisering
  customBranding: false,               // Custom branding per org
  
  // === MARKETING & SALES ===
  marketingModule: false,              // Komplett markedsføringsmodul
  advancedAnalytics: false,            // Avansert analytics og rapporter
  abTesting: false,                    // A/B testing av kampanjer
  leadScoring: false,                  // Lead scoring system
  emailCampaigns: false,               // Email marketing campaigns
  socialMediaScheduling: false,        // Sosiale medier planlegging
  
  // === INTEGRATIONS ===
  facebookIntegration: false,          // Direkte publisering til Facebook
  instagramIntegration: false,         // Direkte publisering til Instagram
  googleMyBusinessIntegration: false,  // Google My Business sync
  mailchimpIntegration: false,         // Mailchimp integration
  hubspotIntegration: false,           // HubSpot CRM integration
  slackIntegration: false,             // Slack notifikasjoner
  
  // === PLATFORM FEATURES ===
  rateLimiting: false,                 // Rate limiting per org
  advancedLogging: false,              // Detaljert logging system
  statusPage: false,                   // Public status page
  apiDocumentation: false,             // Auto-generert API docs
  webhooks: false,                     // Webhook support for external apps
  customDomains: false,                // Custom domains per org
  sslCertificates: false,              // Auto SSL certificates
  
  // === BILLING & SUBSCRIPTIONS ===
  advancedBilling: false,              // Avansert fakturering
  usageBasedBilling: false,            // Usage-based pricing
  customPlans: false,                  // Custom plans per org
  partnerCommissions: false,           // Partner commission tracking
  invoiceAutomation: false,            // Auto invoice generation
  
  // === CUSTOMER FEATURES ===
  customerLoyaltyProgram: false,       // Lojalitetsprogram
  customerReferrals: false,            // Referral program
  customerReviews: false,              // Review system
  customerChatbot: false,              // AI chatbot for customers
  customerSelfService: false,          // Self-service portal
  
  // === REPORTING & ANALYTICS ===
  advancedReports: false,              // Avanserte rapporter
  customReports: false,                // Custom report builder
  dataExport: false,                   // Bulk data export
  dashboardCustomization: false,       // Custom dashboard widgets
  benchmarking: false,                 // Industry benchmarking
  
  // === TEAM & COLLABORATION ===
  teamChat: false,                     // Internal team chat
  taskManagement: false,               // Task/project management
  documentSharing: false,              // Document sharing system
  videoConferencing: false,            // Video meetings
  screenSharing: false,                // Screen sharing
  
  // === MOBILE FEATURES ===
  mobileApp: false,                    // Native mobile app
  pushNotifications: false,            // Push notifications
  offlineMode: false,                  // Offline-first mode
  mobilePOS: false,                    // Mobile point of sale
  
  // === SECURITY & COMPLIANCE ===
  twoFactorAuth: false,                // 2FA for all users
  ssoIntegration: false,               // Single Sign-On
  auditLogs: false,                    // Detailed audit logs
  gdprTools: false,                    // GDPR compliance tools
  dataEncryption: false,               // Advanced encryption
  
  // === EXPERIMENTAL ===
  betaFeatures: false,                 // Enable beta features
  experimentalUI: false,               // New experimental UI
  aiVoiceAssistant: false,             // Voice-based AI assistant
  blockchainIntegration: false,        // Blockchain for receipts/records
};

// ============================================================================
// FEATURE SETTINGS - Configure Each Feature
// ============================================================================

export const FEATURE_SETTINGS = {
  // === AI SETTINGS ===
  ai: {
    booking: {
      maxSuggestions: 5,
      lookAheadDays: 30,
      minConfidenceScore: 0.7,
    },
    capacity: {
      optimizationInterval: 'daily', // 'hourly', 'daily', 'weekly'
      alertThreshold: 0.85, // Alert when 85% capacity
    },
    multiLanguage: {
      supportedLanguages: ['no', 'sv', 'da', 'en'],
      autoDetect: true,
      fallbackLanguage: 'no',
    },
    automation: {
      seasonalCampaigns: {
        daysInAdvance: 14,
        autoPublish: false, // Require manual approval
      },
      autoResponses: {
        enabled: false,
        maxResponseTime: '5 minutes',
        fallbackToHuman: true,
      },
    },
  },
  
  // === MULTI-LOCATION SETTINGS ===
  multiLocation: {
    maxLocations: {
      starter: 1,
      professional: 3,
      enterprise: 999,
    },
    centralizedBooking: true,
    locationSwitching: 'dropdown', // 'dropdown', 'sidebar', 'map'
    crossLocationReporting: true,
  },
  
  // === MARKETING SETTINGS ===
  marketing: {
    campaigns: {
      maxActivePerOrg: 10,
      autoScheduling: true,
      draftSaving: true,
    },
    analytics: {
      trackingEnabled: true,
      customEvents: true,
      realTimeUpdates: true,
    },
    abTesting: {
      maxVariants: 4,
      minSampleSize: 100,
      autoWinner: true,
    },
  },
  
  // === INTEGRATIONS SETTINGS ===
  integrations: {
    rateLimit: {
      facebook: 50, // requests per hour
      instagram: 50,
      googleMyBusiness: 100,
    },
    syncInterval: {
      facebook: 'hourly',
      instagram: 'hourly',
      googleMyBusiness: 'daily',
    },
    autoRetry: true,
    maxRetries: 3,
  },
  
  // === BILLING SETTINGS ===
  billing: {
    advanced: {
      customInvoicing: true,
      multiCurrency: false, // Future: EUR, DKK, SEK
      taxCalculation: 'automatic', // 'automatic', 'manual'
      paymentReminders: true,
    },
    usageBased: {
      trackingGranularity: 'hourly', // 'hourly', 'daily', 'monthly'
      minimumCharge: 0,
      overage: 'included', // 'included', 'charged'
    },
    commissions: {
      defaultRate: 0.15, // 15%
      paymentSchedule: 'monthly', // 'weekly', 'monthly', 'quarterly'
      autoCalculation: true,
    },
  },
  
  // === CUSTOMER FEATURES SETTINGS ===
  customer: {
    loyalty: {
      pointsPerBooking: 10,
      rewardThreshold: 100,
      expirationDays: 365,
    },
    referrals: {
      referrerReward: 100, // NOK or points
      refereeDiscount: 50, // NOK or percentage
      maxReferrals: 999,
    },
    reviews: {
      requireVerifiedBooking: true,
      moderationRequired: false,
      autoPublish: true,
    },
  },
  
  // === REPORTING SETTINGS ===
  reporting: {
    advanced: {
      customMetrics: true,
      scheduledReports: true,
      emailDelivery: true,
    },
    dataExport: {
      formats: ['CSV', 'Excel', 'PDF', 'JSON'],
      maxRows: 100000,
      compression: true,
    },
    retention: {
      rawData: 90, // days
      aggregatedData: 730, // days (2 years)
    },
  },
  
  // === SECURITY SETTINGS ===
  security: {
    twoFactor: {
      required: false,
      methods: ['sms', 'app', 'email'],
      gracePeriod: 7, // days to enable
    },
    sessionManagement: {
      maxSessions: 5,
      timeout: 24, // hours
      autoLogout: true,
    },
    auditLogs: {
      retention: 365, // days
      sensitiveActions: ['delete', 'export', 'planChange'],
    },
  },
  
  // === MOBILE SETTINGS ===
  mobile: {
    app: {
      platforms: ['iOS', 'Android'],
      offlineFirst: true,
      pushEnabled: true,
    },
    pos: {
      receiptPrinter: false,
      cardReader: false,
      cashDrawer: false,
    },
  },
};

// ============================================================================
// FEATURE PRIORITIES - Development Roadmap
// ============================================================================

export const FEATURE_PRIORITIES = {
  // Priority 1: Critical for Launch
  critical: [
    'Basic admin panel',
    'Organization management',
    'Plan/billing basics',
    'User management',
    'Core booking system',
  ],
  
  // Priority 2: Important for Growth
  high: [
    'advancedAnalytics',
    'marketingModule',
    'customerReviews',
    'emailCampaigns',
    'advancedReports',
  ],
  
  // Priority 3: Nice to Have
  medium: [
    'multiLocation',
    'ceoView',
    'rateLimiting',
    'advancedLogging',
    'statusPage',
    'apiDocumentation',
    'customDomains',
  ],
  
  // Priority 4: Future Enhancements
  low: [
    'aiBooking',
    'aiCapacity',
    'aiMultimodal',
    'whiteLabel',
    'abTesting',
    'leadScoring',
    'facebookIntegration',
    'instagramIntegration',
    'slackIntegration',
  ],
  
  // Priority 5: Experimental
  experimental: [
    'aiVoiceAssistant',
    'blockchainIntegration',
    'videoConferencing',
    'screenSharing',
  ],
};

// ============================================================================
// FEATURE AVAILABILITY BY PLAN
// ============================================================================

export const FEATURE_PLAN_MATRIX = {
  starter: [
    // Basic features included in Starter plan
    'basicBooking',
    'basicCustomers',
    'basicReporting',
  ],
  
  professional: [
    // Additional features in Professional plan
    'advancedBooking',
    'multiLocation', // up to 3 locations
    'advancedReports',
    'emailCampaigns',
    'customerReviews',
  ],
  
  enterprise: [
    // All features available in Enterprise plan
    'multiLocation', // unlimited locations
    'ceoView',
    'customBranding',
    'whiteLabel',
    'advancedAutomation',
    'customIntegrations',
    'dedicatedSupport',
    'sla',
  ],
};

// ============================================================================
// FEATURE ROLLOUT TIMELINE
// ============================================================================

export const FEATURE_TIMELINE = {
  // Q1 2025 (January - March)
  q1_2025: [
    'advancedAnalytics',
    'emailCampaigns',
    'customerReviews',
    'rateLimiting',
    'statusPage',
  ],
  
  // Q2 2025 (April - June)
  q2_2025: [
    'multiLocation',
    'ceoView',
    'marketingModule',
    'leadScoring',
    'customDomains',
  ],
  
  // Q3 2025 (July - September)
  q3_2025: [
    'aiBooking',
    'aiCapacity',
    'whiteLabel',
    'abTesting',
    'facebookIntegration',
    'instagramIntegration',
  ],
  
  // Q4 2025 (October - December)
  q4_2025: [
    'aiMultimodal',
    'advancedAutomation',
    'ssoIntegration',
    'webhooks',
    'mobileApp',
  ],
  
  // Future (2026+)
  future: [
    'aiVoiceAssistant',
    'blockchainIntegration',
    'videoConferencing',
    'customPlans',
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(featureName: keyof typeof ADMIN_FEATURE_FLAGS): boolean {
  return ADMIN_FEATURE_FLAGS[featureName] === true;
}

/**
 * Check if a feature is available for a specific plan
 */
export function isFeatureAvailableForPlan(featureName: string, plan: string): boolean {
  const planFeatures = FEATURE_PLAN_MATRIX[plan as keyof typeof FEATURE_PLAN_MATRIX] || [];
  return planFeatures.includes(featureName);
}

/**
 * Get feature settings
 */
export function getFeatureSettings(category: string) {
  return FEATURE_SETTINGS[category as keyof typeof FEATURE_SETTINGS] || {};
}

/**
 * Get features by priority
 */
export function getFeaturesByPriority(priority: keyof typeof FEATURE_PRIORITIES) {
  return FEATURE_PRIORITIES[priority] || [];
}

/**
 * Get features scheduled for a specific quarter
 */
export function getFeaturesForQuarter(quarter: keyof typeof FEATURE_TIMELINE) {
  return FEATURE_TIMELINE[quarter] || [];
}

/**
 * Check if feature is in beta/experimental
 */
export function isExperimentalFeature(featureName: string): boolean {
  return FEATURE_PRIORITIES.experimental.includes(featureName);
}

export default ADMIN_FEATURE_FLAGS;
