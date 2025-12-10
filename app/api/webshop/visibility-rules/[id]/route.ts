import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/webshop/visibility-rules/[id] - Update rule
export async function PATCH(request: NextRequest, context: any) {
  try {
    const params = await context?.params;
    if (!params || !params.id) {
      return NextResponse.json(
        { error: "Missing id in route params" },
        { status: 400 }
      );
    }
    const { id: ruleId } = params as { id: string };
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("org_id, role")
      .eq("id", user.id)
      .single();

    // Only admin/owner can update rules
    if (!profile?.org_id || !["admin", "owner"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify rule belongs to user's org
    const { data: existingRule, error: checkError } = await supabase
      .from("webshop_visibility_rules")
      .select("org_id")
      .eq("id", ruleId)
      .single();

    if (checkError || !existingRule) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    if (existingRule.org_id !== profile.org_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.rule_type !== undefined) updateData.rule_type = body.rule_type;
    if (body.conditions !== undefined) updateData.conditions = body.conditions;
    if (body.product_filters !== undefined)
      updateData.product_filters = body.product_filters;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    const { data: rule, error } = await supabase
      .from("webshop_visibility_rules")
      .update(updateData)
      .eq("id", ruleId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ rule }, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/webshop/visibility-rules/[id] error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to update rule" },
      { status: 500 }
    );
  }
}

// DELETE /api/webshop/visibility-rules/[id] - Delete rule
export async function DELETE(request: NextRequest, context: any) {
  try {
    const params = await context?.params;
    if (!params || !params.id) {
      return NextResponse.json(
        { error: "Missing id in route params" },
        { status: 400 }
      );
    }
    const { id: ruleId } = params as { id: string };
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("org_id, role")
      .eq("id", user.id)
      .single();

    // Only admin/owner can delete rules
    if (!profile?.org_id || !["admin", "owner"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify rule belongs to user's org
    const { data: existingRule, error: checkError } = await supabase
      .from("webshop_visibility_rules")
      .select("org_id")
      .eq("id", ruleId)
      .single();

    if (checkError || !existingRule) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    if (existingRule.org_id !== profile.org_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase
      .from("webshop_visibility_rules")
      .delete()
      .eq("id", ruleId);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/webshop/visibility-rules/[id] error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to delete rule" },
      { status: 500 }
    );
  }
}
