/**
 * Formatting utilities for 4Devs MCP Server
 */

import { Pessoa } from '../api/types.js';

/**
 * Format person data for MCP response
 */
export function formatPersonData(persons: Pessoa[]): string {
  return JSON.stringify(persons, null, 2);
}

/**
 * Format cities HTML response for better readability
 */
export function formatCitiesResponse(cities: Array<{ code: string; name: string }>): string {
  return JSON.stringify({
    description: 'Available cities for the selected state',
    total: cities.length,
    cities: cities
  }, null, 2);
}

/**
 * Format document response (CNH, PIS, Certificate, Voter Registration)
 */
export function formatDocumentResponse(document: string, type: string): string {
  return JSON.stringify({
    type: type,
    document: document,
    generated_at: new Date().toISOString()
  }, null, 2);
}

/**
 * Format error response for MCP
 */
export function formatErrorResponse(error: Error, context?: string): string {
  return JSON.stringify({
    error: true,
    message: error.message,
    context: context || 'Unknown',
    timestamp: new Date().toISOString()
  }, null, 2);
}

/**
 * Format success response for MCP tools
 */
export function formatSuccessResponse(data: any, message?: string): {
  content: Array<{ type: 'text'; text: string }>;
  structuredContent?: any;
} {
  // Deep clone and ensure large numbers stay as strings
  const processData = (obj: any): any => {
    if (typeof obj === 'string') {
      // Check if string looks like a large number and keep it as string
      return obj;
    }
    if (typeof obj === 'number') {
      // Convert large numbers to strings to avoid scientific notation
      if (obj > Number.MAX_SAFE_INTEGER || obj < Number.MIN_SAFE_INTEGER) {
        return String(obj);
      }
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(processData);
    }
    if (obj && typeof obj === 'object') {
      const processed: any = {};
      for (const [key, value] of Object.entries(obj)) {
        processed[key] = processData(value);
      }
      return processed;
    }
    return obj;
  };

  const processedData = processData(data);
  const textContent = typeof processedData === 'string' ? processedData : JSON.stringify(processedData, null, 2);
  
  return {
    content: [
      {
        type: 'text',
        text: message ? `${message}\n\n${textContent}` : textContent
      }
    ],
    structuredContent: Array.isArray(processedData) ? { items: processedData, count: processedData.length } : (typeof processedData === 'object' ? processedData : { result: processedData })
  };
}

/**
 * Format error response for MCP tools
 */
export function formatErrorResponseForTool(error: Error, context?: string): {
  content: Array<{ type: 'text'; text: string }>;
  isError: boolean;
} {
  return {
    content: [
      {
        type: 'text',
        text: formatErrorResponse(error, context)
      }
    ],
    isError: true
  };
}

/**
 * Truncate long text for logging
 */
export function truncateForLog(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * Format log message with timestamp
 */
export function formatLogMessage(level: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${level}] ${timestamp} - ${message}`;
}