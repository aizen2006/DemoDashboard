import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Agent, run } from '@openai/agents';
import { z } from 'zod';

// ============================================
// SCHEMAS
// ============================================

const InsightOutputSchema = z.object({
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

type InsightOutput = z.infer<typeof InsightOutputSchema>;

// ============================================
// AGENT DEFINITIONS
// ============================================

// Data Validator Agent
const DataValidatorAgent = new Agent({
  name: "Data Validator",
  instructions: `
You are a Data Quality Analyst for LYNQ, an EdTech analytics platform.
Validate the incoming learning module metrics data for completeness and anomalies.

STRICT RULES:
- Output MUST be valid JSON only.
- Check for missing required fields (objectiveScore, strScore, engagementRate, completionRate).
- Flag any values outside expected ranges (0-100 for percentages, 0-5 for ratings).
- NO markdown, NO emojis, NO greetings.

OUTPUT FORMAT:
{
  "isValid": boolean,
  "issues": ["issue1", "issue2"],
  "summary": "Brief validation summary"
}
`,
  model: "gpt-4o-mini",
});

// Trend Analyzer Agent
const TrendAnalyzerAgent = new Agent({
  name: "Trend Analyzer",
  instructions: `
You are a Trend Analysis Specialist for LYNQ, an EdTech analytics platform.
Analyze the learning module metrics to identify patterns and performance indicators.

STRICT RULES:
- Output MUST be valid JSON only.
- Analyze engagement rates, completion trends, regional patterns.
- Compare metrics against benchmarks (engagement >70% is good, completion >80% is excellent).
- NO markdown, NO emojis, NO greetings.

OUTPUT FORMAT:
{
  "trends": [
    {
      "metric": "Engagement Rate",
      "direction": "up" | "down" | "stable",
      "analysis": "Specific insight about this trend"
    }
  ],
  "overallHealth": "excellent" | "good" | "needs_attention" | "critical"
}
`,
  model: "gpt-4o-mini",
});

// Recommendation Agent
const RecommendationAgent = new Agent({
  name: "Recommendation Agent",
  instructions: `
You are a Strategic Advisor for LYNQ, an EdTech analytics platform.
Generate specific, actionable recommendations based on the data analysis.

STRICT RULES:
- Output MUST be valid JSON only.
- Each recommendation must be specific and actionable.
- Maximum 4 recommendations.
- NO markdown, NO emojis, NO greetings.

OUTPUT FORMAT:
{
  "recommendations": [
    {
      "priority": "high" | "medium" | "low",
      "action": "Specific action to take",
      "expectedImpact": "Expected outcome"
    }
  ]
}
`,
  model: "gpt-4o-mini",
});

// Summary Agent
const SummaryAgent = new Agent({
  name: "Summary Agent",
  instructions: `
You are the Chief Insights Officer for LYNQ, an EdTech analytics platform.
Synthesize all analysis into a final executive-ready insights report.

STRICT RULES:
- Output MUST be valid JSON only.
- Maximum 4 key insights (bullet points).
- Each insight must be data-driven and specific.
- Include one clear call-to-action.
- Assign a confidence score (0-100).
- NO markdown, NO emojis, NO greetings, NO generic advice.

OUTPUT FORMAT:
{
  "dataQuality": { "isValid": boolean, "issues": [] },
  "trends": [{ "metric": string, "direction": "up"|"down"|"stable", "analysis": string }],
  "insights": ["insight1", "insight2", "insight3", "insight4"],
  "callToAction": "One clear actionable next step",
  "confidence": 85
}
`,
  model: "gpt-4o",
});

// ============================================
// PIPELINE EXECUTION
// ============================================

async function runAgentPipeline(metricsData: string): Promise<InsightOutput> {
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
    console.error("Pipeline execution error:", error);
    throw error;
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
  return output as Record<string, unknown>;
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
  } else if (Array.isArray((recommendations as any)?.recommendations)) {
    (recommendations as any).recommendations.slice(0, 4).forEach((rec: any) => {
      insights.push(rec.action || String(rec));
    });
  }
  
  // Ensure at least one insight
  if (insights.length === 0) {
    insights.push("Analysis completed. Review the detailed metrics for specific insights.");
  }
  
  // Extract trends
  const extractedTrends: InsightOutput['trends'] = [];
  if (Array.isArray((trends as any)?.trends)) {
    (trends as any).trends.slice(0, 3).forEach((t: any) => {
      if (t.metric && t.direction && t.analysis) {
        extractedTrends.push({
          metric: String(t.metric),
          direction: t.direction as 'up' | 'down' | 'stable',
          analysis: String(t.analysis),
        });
      }
    });
  }
  
  return {
    dataQuality: {
      isValid: (validation as any)?.isValid ?? true,
      issues: Array.isArray((validation as any)?.issues) ? (validation as any).issues : undefined,
    },
    trends: extractedTrends,
    insights: insights.slice(0, 4),
    callToAction: String(summary?.callToAction || "Review the analysis and implement the recommended changes."),
    confidence: typeof summary?.confidence === 'number' ? summary.confidence : 75,
  };
}

// ============================================
// API HANDLER
// ============================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ 
      error: 'OpenAI API key not configured',
      fallback: {
        dataQuality: { isValid: false, issues: ["API configuration error"] },
        trends: [],
        insights: ["Unable to generate insights: API key not configured."],
        callToAction: "Contact administrator to configure the OpenAI API key.",
        confidence: 0,
      }
    });
  }
  
  try {
    const { metricsData } = req.body;
    
    if (!metricsData) {
      return res.status(400).json({ error: 'metricsData is required' });
    }
    
    const metricsString = typeof metricsData === 'string' 
      ? metricsData 
      : JSON.stringify(metricsData);
    
    const result = await runAgentPipeline(metricsString);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error("API Error:", error);
    
    // Return graceful fallback
    return res.status(500).json({
      dataQuality: { isValid: false, issues: ["Analysis failed"] },
      trends: [],
      insights: ["An error occurred while generating insights. Please try again."],
      callToAction: "Retry the analysis or contact support if the issue persists.",
      confidence: 0,
    });
  }
}

