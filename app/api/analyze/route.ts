// app/api/analyze/route.ts
// API endpoint for analyzing images and text in messages

import { NextRequest, NextResponse } from "next/server";
import {
  analyzeMessage,
  analyzeImage,
  calculatePaintConditionScore,
  estimateWorkHours,
} from "@/repos/visionAnalysisRepo";
import type { InspectionType } from "@/types/vision";

export type AnalyzeRequestBody = {
  /** Organization ID */
  orgId: string;
  /** Text content to analyze (optional) */
  text?: string;
  /** Array of image URLs to analyze */
  imageUrls?: string[];
  /** Customer ID if known */
  customerId?: string;
  /** Conversation ID if part of a conversation */
  conversationId?: string;
  /** Type of inspection for context */
  inspectionType?: InspectionType;
  /** Whether to include work estimates */
  includeEstimates?: boolean;
};

export type AnalyzeResponseBody = {
  success: boolean;
  data?: {
    analysisId: string;
    summary: string;
    recommendedAction: string;
    textAnalysis?: {
      intent: string;
      serviceInterest: string | null;
      urgency: string;
      sentiment: string;
      entities: Array<{
        type: string;
        value: string;
        confidence: number;
      }>;
      suggestedResponse: string | null;
    };
    imageAnalyses?: Array<{
      imageUrl: string;
      tags: string[];
      confidence: number;
      analysis: string;
      severity: string | null;
      recommendations: string[];
    }>;
    paintCondition?: {
      score: number;
      description: string;
    };
    workEstimate?: {
      minHours: number;
      maxHours: number;
      breakdown: Array<{ task: string; hours: number }>;
    };
    analyzedAt: string;
  };
  error?: string;
};

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeResponseBody>> {
  try {
    const body = (await request.json()) as AnalyzeRequestBody;

    // Validate required fields
    if (!body.orgId) {
      return NextResponse.json(
        { success: false, error: "orgId is required" },
        { status: 400 }
      );
    }

    // Need at least text or images to analyze
    if (!body.text && (!body.imageUrls || body.imageUrls.length === 0)) {
      return NextResponse.json(
        { success: false, error: "Either text or imageUrls must be provided" },
        { status: 400 }
      );
    }

    // Perform the analysis
    const result = await analyzeMessage(
      body.orgId,
      body.text || null,
      body.imageUrls || [],
      body.customerId,
      body.conversationId
    );

    // Build response data
    const responseData: AnalyzeResponseBody["data"] = {
      analysisId: result.id,
      summary: result.summary,
      recommendedAction: result.recommendedAction,
      analyzedAt: result.createdAt,
    };

    // Include text analysis if available
    if (result.textAnalysis) {
      responseData.textAnalysis = {
        intent: result.textAnalysis.intent,
        serviceInterest: result.textAnalysis.serviceInterest,
        urgency: result.textAnalysis.urgency,
        sentiment: result.textAnalysis.sentiment,
        entities: result.textAnalysis.entities,
        suggestedResponse: result.textAnalysis.suggestedResponse,
      };
    }

    // Include image analyses if available
    if (result.imageAnalyses.length > 0) {
      responseData.imageAnalyses = result.imageAnalyses.map((img) => ({
        imageUrl: img.imageUrl,
        tags: img.tags,
        confidence: img.confidence,
        analysis: img.analysis,
        severity: img.severity,
        recommendations: img.recommendations,
      }));

      // Calculate paint condition score
      responseData.paintCondition = calculatePaintConditionScore(result.imageAnalyses);

      // Include work estimates if requested
      if (body.includeEstimates) {
        responseData.workEstimate = estimateWorkHours(result.imageAnalyses);
      }
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("[Analyze API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

// Endpoint for analyzing a single image
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("imageUrl");
  const inspectionType = searchParams.get("inspectionType") as InspectionType | null;

  if (!imageUrl) {
    return NextResponse.json(
      { success: false, error: "imageUrl query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const result = await analyzeImage(imageUrl, inspectionType || "general");

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: result.imageUrl,
        tags: result.tags,
        confidence: result.confidence,
        analysis: result.analysis,
        vehicleSection: result.vehicleSection,
        severity: result.severity,
        recommendations: result.recommendations,
        analyzedAt: result.analyzedAt,
      },
    });
  } catch (error) {
    console.error("[Analyze API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
