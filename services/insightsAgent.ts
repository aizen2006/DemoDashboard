import { Agent, run } from "@openai/agents";
import { z } from "zod";

// ============================================
// OUTPUT SCHEMAS (Guardrails)
// ============================================

// Data Validator Agent Output Schema
export const DataValidationSchema = z.object({
  isValid: z.boolean(),
  issues: z.array(z.string()).optional(),
  sanitizedData: z.record(z.string(), z.any()).optional(),
});

// Trend Analyzer Agent Output Schema
export const TrendAnalysisSchema = z.object({
  trends: z.array(z.object({
    metric: z.string(),
    direction: z.enum(['up', 'down', 'stable']),
    percentageChange: z.number().optional(),
    analysis: z.string(),
  })),
  overallHealth: z.enum(['excellent', 'good', 'needs_attention', 'critical']),
});

// Recommendation Agent Output Schema
export const RecommendationSchema = z.object({
  recommendations: z.array(z.object({
    priority: z.enum(['high', 'medium', 'low']),
    area: z.string(),
    action: z.string(),
    expectedImpact: z.string(),
  })),
});

// Summary Agent / Final Output Schema
export const InsightOutputSchema = z.object({
  dataQuality: z.object({
    isValid: z.boolean(),
    issues: z.array(z.string()).optional(),
  }),
  trends: z.array(z.object({
    metric: z.string(),
    direction: z.enum(['up', 'down', 'stable']),
    analysis: z.string(),
  })),
  insights: z.array(z.string()).max(4),
  callToAction: z.string(),
  confidence: z.number().min(0).max(100),
});

// TypeScript Types
export type DataValidationOutput = z.infer<typeof DataValidationSchema>;
export type TrendAnalysisOutput = z.infer<typeof TrendAnalysisSchema>;
export type RecommendationOutput = z.infer<typeof RecommendationSchema>;
export type InsightOutput = z.infer<typeof InsightOutputSchema>;

// ============================================
// AGENT DEFINITIONS
// ============================================

// 1. Data Validator Agent
const dataValidatorInstructions = `
You are a Data Quality Analyst for LYNQ, an EdTech analytics platform.

YOUR TASK:
Validate the incoming learning module metrics data for completeness and anomalies.

STRICT RULES:
- Output MUST be valid JSON only.
- Check for missing required fields (objectiveScore, strScore, engagementRate, completionRate).
- Flag any values outside expected ranges (0-100 for percentages, 0-5 for ratings).
- Identify any data anomalies or inconsistencies.
- NO markdown, NO emojis, NO greetings, NO extra commentary.

OUTPUT FORMAT:
{
  "isValid": boolean,
  "issues": ["issue1", "issue2"] (optional, only if isValid is false),
  "sanitizedData": { ...cleaned data object } (optional)
}
`;

export const DataValidatorAgent = new Agent({
  name: "Data Validator",
  instructions: dataValidatorInstructions,
  model: "gpt-4o-mini",
});

// 2. Trend Analyzer Agent
const trendAnalyzerInstructions = `
You are a Trend Analysis Specialist for LYNQ, an EdTech analytics platform.

YOUR TASK:
Analyze the learning module metrics to identify patterns, trends, and performance indicators.

STRICT RULES:
- Output MUST be valid JSON only.
- Analyze engagement rates, completion trends, regional patterns, and score distributions.
- Compare metrics against industry benchmarks (engagement >70% is good, completion >80% is excellent).
- Identify correlations between different metrics.
- NO markdown, NO emojis, NO greetings, NO extra commentary.

OUTPUT FORMAT:
{
  "trends": [
    {
      "metric": "Engagement Rate",
      "direction": "up" | "down" | "stable",
      "percentageChange": number (optional),
      "analysis": "Specific insight about this trend"
    }
  ],
  "overallHealth": "excellent" | "good" | "needs_attention" | "critical"
}
`;

export const TrendAnalyzerAgent = new Agent({
  name: "Trend Analyzer",
  instructions: trendAnalyzerInstructions,
  model: "gpt-4o-mini",
});

// 3. Recommendation Agent
const recommendationInstructions = `
You are a Strategic Advisor for LYNQ, an EdTech analytics platform.

YOUR TASK:
Generate specific, actionable recommendations based on the data analysis.

STRICT RULES:
- Output MUST be valid JSON only.
- Each recommendation must be specific and actionable (not generic advice).
- Prioritize recommendations by potential impact.
- Focus on quick wins and high-impact changes.
- NO markdown, NO emojis, NO greetings, NO extra commentary.

OUTPUT FORMAT:
{
  "recommendations": [
    {
      "priority": "high" | "medium" | "low",
      "area": "Engagement" | "Completion" | "Content" | "Regional" | "Assessment",
      "action": "Specific action to take",
      "expectedImpact": "Expected outcome of this action"
    }
  ]
}
`;

export const RecommendationAgent = new Agent({
  name: "Recommendation Agent",
  instructions: recommendationInstructions,
  model: "gpt-4o-mini",
});

// 4. Summary Agent (Orchestrator)
const summaryAgentInstructions = `
You are the Chief Insights Officer for LYNQ, an EdTech analytics platform.

YOUR TASK:
Synthesize all analysis into a final, executive-ready insights report.

STRICT RULES:
- Output MUST be valid JSON only.
- Maximum 4 key insights (bullet points).
- Each insight must be data-driven and specific.
- Include one clear call-to-action.
- Assign a confidence score (0-100) based on data quality and analysis depth.
- NO markdown, NO emojis, NO greetings, NO extra commentary.
- If performance is excellent, suggest advanced optimization strategies.

OUTPUT FORMAT:
{
  "dataQuality": {
    "isValid": boolean,
    "issues": ["issue1"] (optional)
  },
  "trends": [
    {
      "metric": "string",
      "direction": "up" | "down" | "stable",
      "analysis": "string"
    }
  ],
  "insights": ["insight1", "insight2", "insight3", "insight4"],
  "callToAction": "One clear, actionable next step",
  "confidence": 85
}
`;

export const SummaryAgent = new Agent({
  name: "Summary Agent",
  instructions: summaryAgentInstructions,
  model: "gpt-4o",
});

// ============================================
// MAIN EXECUTION FUNCTION (Simplified Pipeline)
// ============================================

export async function generateAgentInsights(metricsData: string): Promise<InsightOutput> {
  try {
    // Step 1: Validate Data
    const validationResult = await run(DataValidatorAgent, `Validate this metrics data: ${metricsData}`);
    const validationOutput = parseAgentOutput(validationResult.finalOutput);
    
    // Step 2: Analyze Trends
    const trendResult = await run(TrendAnalyzerAgent, `Analyze trends in this data: ${metricsData}`);
    const trendOutput = parseAgentOutput(trendResult.finalOutput);
    
    // Step 3: Generate Recommendations
    const combinedAnalysis = JSON.stringify({
      metrics: JSON.parse(metricsData),
      validation: validationOutput,
      trends: trendOutput,
    });
    const recommendationResult = await run(RecommendationAgent, `Generate recommendations based on: ${combinedAnalysis}`);
    const recommendationOutput = parseAgentOutput(recommendationResult.finalOutput);
    
    // Step 4: Synthesize Final Summary
    const fullAnalysis = JSON.stringify({
      metrics: JSON.parse(metricsData),
      validation: validationOutput,
      trends: trendOutput,
      recommendations: recommendationOutput,
    });
    const summaryResult = await run(SummaryAgent, `Create final insights report from: ${fullAnalysis}`);
    const summaryOutput = parseAgentOutput(summaryResult.finalOutput);
    
    // Validate final output
    const validated = InsightOutputSchema.safeParse(summaryOutput);
    
    if (validated.success) {
      return validated.data;
    }
    
    // Construct valid output from partial data
    return constructFallbackOutput(summaryOutput, validationOutput, trendOutput, recommendationOutput);
  } catch (error) {
    console.error("Agent execution error:", error);
    
    // Return error fallback
    return {
      dataQuality: { isValid: false, issues: ["Agent execution failed"] },
      trends: [],
      insights: ["Unable to generate insights at this time. Please try again."],
      callToAction: "Retry the analysis or contact support if the issue persists.",
      confidence: 0,
    };
  }
}

function parseAgentOutput(output: unknown): Record<string, unknown> {
  if (typeof output === 'string') {
    try {
      // Remove markdown code blocks if present
      const cleaned = output.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return { raw: output };
    }
  }
  return (output as Record<string, unknown>) || {};
}

function constructFallbackOutput(
  summary: Record<string, unknown>,
  validation: Record<string, unknown>,
  trends: Record<string, unknown>,
  recommendations: Record<string, unknown>
): InsightOutput {
  // Extract insights from recommendations if summary insights are missing
  const insights: string[] = [];
  
  if (Array.isArray(summary?.insights)) {
    insights.push(...summary.insights.slice(0, 4).map(String));
  } else if (Array.isArray((recommendations as Record<string, unknown>)?.recommendations)) {
    const recs = (recommendations as Record<string, unknown>).recommendations as Array<Record<string, unknown>>;
    recs.slice(0, 4).forEach((rec) => {
      insights.push(String(rec.action || rec));
    });
  }
  
  // Ensure at least one insight
  if (insights.length === 0) {
    insights.push("Analysis completed. Review the detailed metrics for specific insights.");
  }
  
  // Extract trends
  const extractedTrends: InsightOutput['trends'] = [];
  const trendData = trends as Record<string, unknown>;
  if (Array.isArray(trendData?.trends)) {
    const trendArray = trendData.trends as Array<Record<string, unknown>>;
    trendArray.slice(0, 3).forEach((t) => {
      if (t.metric && t.direction && t.analysis) {
        extractedTrends.push({
          metric: String(t.metric),
          direction: t.direction as 'up' | 'down' | 'stable',
          analysis: String(t.analysis),
        });
      }
    });
  }
  
  const validationData = validation as Record<string, unknown>;
  
  return {
    dataQuality: {
      isValid: (validationData?.isValid as boolean) ?? true,
      issues: Array.isArray(validationData?.issues) ? validationData.issues as string[] : undefined,
    },
    trends: extractedTrends,
    insights: insights.slice(0, 4),
    callToAction: String(summary?.callToAction || "Review the analysis and implement the recommended changes."),
    confidence: typeof summary?.confidence === 'number' ? summary.confidence : 75,
  };
}

// ============================================
// SIMPLIFIED SINGLE-AGENT FALLBACK
// ============================================

const singleAgentInstructions = `
You are a Senior Data Analyst AI for LYNQ, an EdTech analytics platform.

Analyze the provided learning module metrics and generate insights.

STRICT RULES:
- Output MUST be valid JSON only.
- You MUST return exactly this structure:
{
  "dataQuality": { "isValid": boolean, "issues": [] },
  "trends": [{ "metric": string, "direction": "up"|"down"|"stable", "analysis": string }],
  "insights": [max 4 bullet points as strings],
  "callToAction": "1 short actionable sentence",
  "confidence": number between 0-100
}
- NO extra commentary.
- NO markdown.
- NO emojis.
- NO greetings.
- NO generic advice.
- ONLY data-driven insights.
- Each insight must be actionable and specific.
`;

export const SingleInsightsAgent = new Agent({
  name: "LYNQ Insights Agent",
  instructions: singleAgentInstructions,
  model: "gpt-4o-mini",
});

export async function generateSimpleInsights(metricsData: string): Promise<InsightOutput> {
  try {
    const result = await run(SingleInsightsAgent, `Analyze this data: ${metricsData}`);
    
    const output = parseAgentOutput(result.finalOutput);
    
    const validated = InsightOutputSchema.safeParse(output);
    
    if (validated.success) {
      return validated.data;
    }
    
    // Attempt to construct valid output from partial data
    return {
      dataQuality: { isValid: true },
      trends: Array.isArray(output?.trends) ? output.trends as InsightOutput['trends'] : [],
      insights: Array.isArray(output?.insights) ? (output.insights as string[]).slice(0, 4) : [],
      callToAction: String(output?.callToAction || "Review the analysis for next steps."),
      confidence: typeof output?.confidence === 'number' ? output.confidence : 70,
    };
  } catch (error) {
    console.error("Simple agent error:", error);
    return {
      dataQuality: { isValid: false, issues: ["Analysis failed"] },
      trends: [],
      insights: ["Unable to generate insights. Please try again."],
      callToAction: "Retry the analysis.",
      confidence: 0,
    };
  }
}
