// Frontend service layer for OpenAI Agent-powered insights
import OpenAI from 'openai';

export interface InsightTrend {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  analysis: string;
}

export interface InsightOutput {
  dataQuality: {
    isValid: boolean;
    issues?: string[];
  };
  trends: InsightTrend[];
  insights: string[];
  callToAction: string;
  confidence: number;
}

// Initialize OpenAI client
// Note: In production, this should be called from a serverless function
const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });
};

// System prompt for the insights agent
const INSIGHTS_SYSTEM_PROMPT = `
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
- NO extra commentary before or after the JSON.
- NO markdown code blocks.
- NO emojis.
- NO greetings.
- NO generic advice.
- ONLY data-driven insights.
- Each insight must be actionable and specific.
- Analyze engagement rates, completion rates, regional performance, and score distributions.
- If performance is excellent, suggest advanced optimization strategies.
`;

/**
 * Generates AI-powered insights from module metrics data using OpenAI
 * @param metricsData - The module metrics data to analyze
 * @returns Structured insights output
 */
export async function generateAgentInsights(metricsData: unknown): Promise<InsightOutput> {
  try {
    const openai = getOpenAIClient();
    
    const metricsString = typeof metricsData === 'string' 
      ? metricsData 
      : JSON.stringify(metricsData, null, 2);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: INSIGHTS_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Analyze this learning module metrics data and provide insights:\n\n${metricsString}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const parsed = JSON.parse(content);
    
    // Validate and return the structured output
    return validateAndNormalizeOutput(parsed);
  } catch (error) {
    console.error('Agent service error:', error);
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return {
          dataQuality: {
            isValid: false,
            issues: ['API key not configured'],
          },
          trends: [],
          insights: [
            'OpenAI API key is not configured.',
            'Please add VITE_OPENAI_API_KEY to your .env file.',
          ],
          callToAction: 'Configure the API key to enable AI insights.',
          confidence: 0,
        };
      }
      
      if (error.message.includes('401') || error.message.includes('invalid_api_key')) {
        return {
          dataQuality: {
            isValid: false,
            issues: ['Invalid API key'],
          },
          trends: [],
          insights: [
            'The OpenAI API key is invalid or expired.',
            'Please check your API key and try again.',
          ],
          callToAction: 'Update your API key in the .env file.',
          confidence: 0,
        };
      }
    }
    
    // Generic error fallback
    return {
      dataQuality: {
        isValid: false,
        issues: [error instanceof Error ? error.message : 'Unknown error occurred'],
      },
      trends: [],
      insights: [
        'Unable to generate insights at this time.',
        'Please check your connection and try again.',
      ],
      callToAction: 'Retry the analysis or contact support if the issue persists.',
      confidence: 0,
    };
  }
}

/**
 * Validates and normalizes the AI response to ensure it matches our expected format
 */
function validateAndNormalizeOutput(parsed: unknown): InsightOutput {
  const data = parsed as Record<string, unknown>;
  
  // Extract and validate dataQuality
  const dataQuality = data.dataQuality as Record<string, unknown> | undefined;
  const normalizedDataQuality = {
    isValid: typeof dataQuality?.isValid === 'boolean' ? dataQuality.isValid : true,
    issues: Array.isArray(dataQuality?.issues) 
      ? (dataQuality.issues as string[]).filter(i => typeof i === 'string')
      : undefined,
  };
  
  // Extract and validate trends
  const trends: InsightTrend[] = [];
  if (Array.isArray(data.trends)) {
    for (const trend of data.trends) {
      const t = trend as Record<string, unknown>;
      if (
        typeof t.metric === 'string' &&
        ['up', 'down', 'stable'].includes(t.direction as string) &&
        typeof t.analysis === 'string'
      ) {
        trends.push({
          metric: t.metric,
          direction: t.direction as 'up' | 'down' | 'stable',
          analysis: t.analysis,
        });
      }
    }
  }
  
  // Extract and validate insights
  let insights: string[] = [];
  if (Array.isArray(data.insights)) {
    insights = (data.insights as unknown[])
      .filter(i => typeof i === 'string')
      .slice(0, 4) as string[];
  }
  
  // Ensure at least one insight
  if (insights.length === 0) {
    insights = ['Analysis completed. Review the metrics for detailed information.'];
  }
  
  // Extract callToAction
  const callToAction = typeof data.callToAction === 'string' 
    ? data.callToAction 
    : 'Review the analysis and take appropriate action.';
  
  // Extract confidence
  let confidence = 75;
  if (typeof data.confidence === 'number') {
    confidence = Math.max(0, Math.min(100, data.confidence));
  }
  
  return {
    dataQuality: normalizedDataQuality,
    trends,
    insights,
    callToAction,
    confidence,
  };
}

/**
 * Formats the insight output for display
 * @param output - The raw insight output
 * @returns Formatted display data
 */
export function formatInsightsForDisplay(output: InsightOutput): {
  healthStatus: 'excellent' | 'good' | 'warning' | 'error';
  healthColor: string;
  confidenceLabel: string;
} {
  // Determine health status based on confidence and data quality
  let healthStatus: 'excellent' | 'good' | 'warning' | 'error';
  let healthColor: string;
  
  if (!output.dataQuality.isValid || output.confidence === 0) {
    healthStatus = 'error';
    healthColor = 'text-red-500';
  } else if (output.confidence >= 80) {
    healthStatus = 'excellent';
    healthColor = 'text-emerald-500';
  } else if (output.confidence >= 60) {
    healthStatus = 'good';
    healthColor = 'text-blue-500';
  } else {
    healthStatus = 'warning';
    healthColor = 'text-yellow-500';
  }
  
  // Format confidence label
  let confidenceLabel: string;
  if (output.confidence >= 80) {
    confidenceLabel = 'High Confidence';
  } else if (output.confidence >= 60) {
    confidenceLabel = 'Moderate Confidence';
  } else if (output.confidence > 0) {
    confidenceLabel = 'Low Confidence';
  } else {
    confidenceLabel = 'Analysis Failed';
  }
  
  return {
    healthStatus,
    healthColor,
    confidenceLabel,
  };
}

/**
 * Gets the trend icon direction for display
 * @param direction - The trend direction
 * @returns Icon name for lucide-react
 */
export function getTrendIcon(direction: 'up' | 'down' | 'stable'): string {
  switch (direction) {
    case 'up':
      return 'TrendingUp';
    case 'down':
      return 'TrendingDown';
    case 'stable':
      return 'Minus';
  }
}

/**
 * Gets the trend color class for display
 * @param direction - The trend direction
 * @returns Tailwind color class
 */
export function getTrendColor(direction: 'up' | 'down' | 'stable'): string {
  switch (direction) {
    case 'up':
      return 'text-emerald-500';
    case 'down':
      return 'text-rose-500';
    case 'stable':
      return 'text-slate-500';
  }
}
