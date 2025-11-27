// Frontend service layer for calling the OpenAI Agent API

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

// API endpoint - uses Vercel serverless function in production, or local proxy in development
const API_ENDPOINT = import.meta.env.VITE_API_URL || '/api/insights';

/**
 * Generates AI-powered insights from module metrics data using OpenAI agents
 * @param metricsData - The module metrics data to analyze
 * @returns Structured insights output
 */
export async function generateAgentInsights(metricsData: unknown): Promise<InsightOutput> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metricsData: typeof metricsData === 'string' ? metricsData : JSON.stringify(metricsData),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // If there's a fallback in the error response, use it
      if (errorData.fallback) {
        return errorData.fallback as InsightOutput;
      }
      
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    // Validate the response structure
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid response format');
    }

    return result as InsightOutput;
  } catch (error) {
    console.error('Agent service error:', error);
    
    // Return a graceful fallback response
    return {
      dataQuality: {
        isValid: false,
        issues: [error instanceof Error ? error.message : 'Unknown error occurred'],
      },
      trends: [],
      insights: [
        'Unable to connect to the AI analysis service.',
        'Please check your internet connection and try again.',
      ],
      callToAction: 'Retry the analysis or contact support if the issue persists.',
      confidence: 0,
    };
  }
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

