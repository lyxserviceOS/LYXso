/**
 * Visibility Rules Evaluation Service
 * 
 * Evaluates visibility rules to determine which products should be visible to a user
 * based on their profile (customer type, location, plan, etc.)
 */

import { SupabaseClient } from "@supabase/supabase-js";

export interface VisibilityRule {
  id: string;
  org_id: string;
  name: string;
  rule_type: "customer_type" | "location" | "plan" | "custom";
  conditions: {
    customer_types?: string[]; // ["private", "business", "vip"]
    locations?: string[];
    plans?: string[];
    custom?: any;
  };
  product_filters: {
    categories?: string[];
    tags?: string[];
    price_range?: {
      min?: number;
      max?: number;
    };
    partner_products?: boolean;
    own_products?: boolean;
    specific_product_ids?: string[];
  };
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserContext {
  customer_type?: "private" | "business" | "vip";
  location?: string;
  plan?: string;
  org_id: string;
  user_id: string;
}

export interface ProductFilter {
  categories?: string[];
  tags?: string[];
  min_price?: number;
  max_price?: number;
  include_partner_products?: boolean;
  include_own_products?: boolean;
  specific_product_ids?: string[];
}

/**
 * Evaluates if a rule matches the user's context
 */
function doesRuleMatchUser(rule: VisibilityRule, userContext: UserContext): boolean {
  const { conditions } = rule;

  // Rule type: customer_type
  if (rule.rule_type === "customer_type" && conditions.customer_types?.length) {
    if (!userContext.customer_type) return false;
    if (!conditions.customer_types.includes(userContext.customer_type)) {
      return false;
    }
  }

  // Rule type: location
  if (rule.rule_type === "location" && conditions.locations?.length) {
    if (!userContext.location) return false;
    if (!conditions.locations.includes(userContext.location)) {
      return false;
    }
  }

  // Rule type: plan
  if (rule.rule_type === "plan" && conditions.plans?.length) {
    if (!userContext.plan) return false;
    if (!conditions.plans.includes(userContext.plan)) {
      return false;
    }
  }

  // Rule type: custom
  if (rule.rule_type === "custom" && conditions.custom) {
    // Custom logic can be extended here
    // For now, just return true if custom conditions exist
    return true;
  }

  // If no specific conditions, rule matches all
  return true;
}

/**
 * Converts a rule's product_filters to a ProductFilter object
 */
function ruleToProductFilter(rule: VisibilityRule): ProductFilter {
  const { product_filters } = rule;
  
  return {
    categories: product_filters.categories,
    tags: product_filters.tags,
    min_price: product_filters.price_range?.min,
    max_price: product_filters.price_range?.max,
    include_partner_products: product_filters.partner_products,
    include_own_products: product_filters.own_products,
    specific_product_ids: product_filters.specific_product_ids,
  };
}

/**
 * Evaluates visibility rules for a user and returns the applicable product filter
 * 
 * Rules are evaluated in priority order (highest first).
 * The first rule that matches the user determines the product filter.
 */
export async function evaluateVisibilityRules(
  supabase: SupabaseClient,
  userContext: UserContext
): Promise<ProductFilter | null> {
  try {
    // Fetch all active rules for the organization, sorted by priority (descending)
    const { data: rules, error } = await supabase
      .from("webshop_visibility_rules")
      .select("*")
      .eq("org_id", userContext.org_id)
      .eq("is_active", true)
      .order("priority", { ascending: false });

    if (error) {
      console.error("Error fetching visibility rules:", error);
      return null; // Return null to show all products (fallback)
    }

    if (!rules || rules.length === 0) {
      // No rules defined, show all products
      return null;
    }

    // Find the first matching rule
    for (const rule of rules) {
      if (doesRuleMatchUser(rule, userContext)) {
        // Found a matching rule, apply its product filters
        return ruleToProductFilter(rule);
      }
    }

    // No rules matched, show all products
    return null;
  } catch (error) {
    console.error("Error evaluating visibility rules:", error);
    return null; // Fallback to showing all products on error
  }
}

/**
 * Applies product filter to a Supabase query
 * 
 * @param query - The base Supabase query builder
 * @param filter - The product filter to apply
 * @param includePartnerProducts - Whether to query partner products table
 */
export function applyProductFilter(
  query: any,
  filter: ProductFilter | null
): any {
  if (!filter) {
    // No filter, return query as is (show all products)
    return query;
  }

  // Apply category filter
  if (filter.categories && filter.categories.length > 0) {
    query = query.in("category", filter.categories);
  }

  // Apply tags filter (if product has any of the specified tags)
  if (filter.tags && filter.tags.length > 0) {
    // tags is a text[] column, use overlap operator
    query = query.overlaps("tags", filter.tags);
  }

  // Apply price range filter
  if (filter.min_price !== undefined) {
    query = query.gte("price", filter.min_price);
  }
  if (filter.max_price !== undefined) {
    query = query.lte("price", filter.max_price);
  }

  // Apply specific product IDs filter
  if (filter.specific_product_ids && filter.specific_product_ids.length > 0) {
    query = query.in("id", filter.specific_product_ids);
  }

  return query;
}

/**
 * Gets user context from database
 * This fetches customer type, location, plan from user's profile and org
 */
export async function getUserContext(
  supabase: SupabaseClient,
  userId: string
): Promise<UserContext | null> {
  try {
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("org_id, metadata")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching user profile:", profileError);
      return null;
    }

    // Fetch org details to get plan
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("plan_id, metadata")
      .eq("id", profile.org_id)
      .single();

    if (orgError) {
      console.error("Error fetching organization:", orgError);
    }

    // Extract customer type from metadata (if stored there)
    const customerType = profile.metadata?.customer_type || "private";
    const location = profile.metadata?.location || org?.metadata?.location;
    const plan = org?.plan_id;

    return {
      user_id: userId,
      org_id: profile.org_id,
      customer_type: customerType,
      location: location,
      plan: plan,
    };
  } catch (error) {
    console.error("Error getting user context:", error);
    return null;
  }
}

/**
 * High-level function to fetch visible products for a user
 * 
 * This combines rule evaluation and product filtering
 */
export async function getVisibleProductsForUser(
  supabase: SupabaseClient,
  userId: string,
  options: {
    category?: string;
    search?: string;
    is_active?: boolean;
    include_partner_products?: boolean;
  } = {}
): Promise<any[]> {
  try {
    // Get user context
    const userContext = await getUserContext(supabase, userId);
    if (!userContext) {
      throw new Error("Could not determine user context");
    }

    // Evaluate visibility rules
    const productFilter = await evaluateVisibilityRules(supabase, userContext);

    // Build base query for own products
    let ownProductsQuery = supabase
      .from("webshop_products")
      .select("*, 'own' as product_source")
      .eq("org_id", userContext.org_id)
      .eq("is_active", options.is_active !== false);

    // Apply visibility filter
    ownProductsQuery = applyProductFilter(ownProductsQuery, productFilter);

    // Apply additional filters from options
    if (options.category) {
      ownProductsQuery = ownProductsQuery.eq("category", options.category);
    }
    if (options.search) {
      ownProductsQuery = ownProductsQuery.or(
        `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
      );
    }

    const { data: ownProducts, error: ownError } = await ownProductsQuery;

    if (ownError) {
      console.error("Error fetching own products:", ownError);
      return [];
    }

    let allProducts: Array<{ [key: string]: any; product_source: 'own' | 'partner' }> = ownProducts || [];

    // Fetch partner products if enabled
    if (
      options.include_partner_products &&
      (productFilter?.include_partner_products !== false)
    ) {
      let partnerQuery = supabase
        .from("webshop_partner_products")
        .select("*, 'partner' as product_source")
        .eq("org_id", userContext.org_id)
        .eq("is_active", true);

      // Apply visibility filter
      partnerQuery = applyProductFilter(partnerQuery, productFilter);

      // Apply additional filters
      if (options.category) {
        partnerQuery = partnerQuery.eq("category", options.category);
      }
      if (options.search) {
        partnerQuery = partnerQuery.or(
          `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
        );
      }

      const { data: partnerProducts, error: partnerError } = await partnerQuery;

      if (!partnerError && partnerProducts) {
        allProducts = [...allProducts, ...partnerProducts];
      }
    }

    return allProducts;
  } catch (error) {
    console.error("Error getting visible products:", error);
    return [];
  }
}
