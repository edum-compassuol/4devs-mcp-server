/**
 * CNH Generator Tool
 * Generates Brazilian driver's license (CNH) numbers
 */

import { z } from 'zod';
import { apiClient } from '../api/client.js';
import { GeradorCNHRequest, GeradorCNHResponse } from '../api/types.js';
import { formatSuccessResponse, formatErrorResponseForTool } from '../utils/formatting.js';

// Zod schema for input validation (no parameters needed for CNH generation)
export const cnhGeneratorSchema = z.object({});

export type CNHGeneratorInput = z.infer<typeof cnhGeneratorSchema>;

/**
 * Generate CNH number using 4Devs API
 */
export async function generateCNH(input: CNHGeneratorInput) {
  console.error('[Setup] Starting CNH generation...');
  
  try {
    // Validate input parameters (empty object is valid)
    const validatedInput = cnhGeneratorSchema.parse(input);

    // Prepare API request
    const apiRequest: GeradorCNHRequest = {
      acao: 'gerar_cnh'
    };

    console.error('[API] Generating CNH number...');
    
    // Make API request
    const response = await apiClient.makeRequest<GeradorCNHResponse>(apiRequest);
    
    // Validate response
    if (typeof response !== 'string') {
      throw new Error('Invalid response format: expected string');
    }
    
    if (!response.trim()) {
      throw new Error('Empty CNH number generated');
    }

    // Validate CNH format (should be 11 digits)
    const cnhNumber = response.trim();
    if (!/^\d{11}$/.test(cnhNumber)) {
      console.error(`[Warning] CNH number may have unexpected format: ${cnhNumber}`);
    }

    console.error(`[API] Successfully generated CNH: ${cnhNumber}`);

    // Return formatted response
    const result = {
      document_type: 'CNH',
      cnh_number: cnhNumber,
      format: 'Numeric only (11 digits)',
      generated_at: new Date().toISOString()
    };

    return formatSuccessResponse(
      result,
      'Successfully generated Brazilian CNH (driver\'s license) number'
    );

  } catch (error) {
    console.error('[Error] CNH generation failed:', error);
    
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return formatErrorResponseForTool(
        new Error(`Validation failed: ${validationErrors}`),
        'cnh-generator'
      );
    }
    
    return formatErrorResponseForTool(
      error instanceof Error ? error : new Error('Unknown error occurred'),
      'cnh-generator'
    );
  }
}

// Tool configuration for MCP server
export const cnhGeneratorTool = {
  name: 'gerar_cnh',
  description: 'Generate a valid Brazilian CNH (Carteira Nacional de Habilitação - driver\'s license) number. Returns an 11-digit numeric code that follows Brazilian CNH formatting standards.',
  inputSchema: cnhGeneratorSchema,
  handler: generateCNH
};