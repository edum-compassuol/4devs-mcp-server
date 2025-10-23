/**
 * PIS Generator Tool
 * Generates Brazilian PIS (social security) numbers
 */

import { z } from 'zod';
import { apiClient } from '../api/client.js';
import { GeradorPISRequest, GeradorPISResponse } from '../api/types.js';
import { validatePunctuation, createValidationError } from '../utils/validation.js';
import { formatSuccessResponse, formatErrorResponseForTool } from '../utils/formatting.js';

// Zod schema for input validation
export const pisGeneratorSchema = z.object({
  pontuacao: z.enum(['S', 'N']).optional().default('N').describe('Include punctuation: S (Yes), N (No)')
});

export type PISGeneratorInput = z.infer<typeof pisGeneratorSchema>;

/**
 * Generate PIS number using 4Devs API
 */
export async function generatePIS(input: PISGeneratorInput) {
  console.error('[Setup] Starting PIS generation...');
  
  try {
    // Validate input parameters
    const validatedInput = pisGeneratorSchema.parse(input);

    // Prepare API request
    const apiRequest: GeradorPISRequest = {
      acao: 'gerar_pis'
    };

    // Add optional parameters
    if (validatedInput.pontuacao) {
      apiRequest.pontuacao = validatedInput.pontuacao;
    }

    console.error(`[API] Generating PIS number with punctuation: ${validatedInput.pontuacao}`);
    
    // Make API request
    const response = await apiClient.makeRequest<GeradorPISResponse>(apiRequest);
    
    // Validate response
    if (typeof response !== 'string') {
      throw new Error('Invalid response format: expected string');
    }
    
    if (!response.trim()) {
      throw new Error('Empty PIS number generated');
    }

    const pisNumber = response.trim();
    
    // Validate PIS format
    const expectedFormat = validatedInput.pontuacao === 'S' ? 
      /^\d{3}\.\d{5}\.\d{2}-\d$/ : // With punctuation: 123.45678.90-1
      /^\d{11}$/; // Without punctuation: 12345678901
    
    if (!expectedFormat.test(pisNumber)) {
      console.error(`[Warning] PIS number may have unexpected format: ${pisNumber}`);
    }

    console.error(`[API] Successfully generated PIS: ${pisNumber}`);

    // Return formatted response
    const result = {
      document_type: 'PIS',
      pis_number: pisNumber,
      punctuation: validatedInput.pontuacao === 'S' ? 'Included' : 'Not included',
      format: validatedInput.pontuacao === 'S' ? 'XXX.XXXXX.XX-X' : 'XXXXXXXXXXX',
      generated_at: new Date().toISOString()
    };

    return formatSuccessResponse(
      result,
      'Successfully generated Brazilian PIS (social security) number'
    );

  } catch (error) {
    console.error('[Error] PIS generation failed:', error);
    
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return formatErrorResponseForTool(
        new Error(`Validation failed: ${validationErrors}`),
        'pis-generator'
      );
    }
    
    return formatErrorResponseForTool(
      error instanceof Error ? error : new Error('Unknown error occurred'),
      'pis-generator'
    );
  }
}

// Tool configuration for MCP server
export const pisGeneratorTool = {
  name: 'gerar_pis',
  description: 'Generate a valid Brazilian PIS (Programa de Integração Social - social security) number. Supports optional punctuation formatting (XXX.XXXXX.XX-X) or numeric only format.',
  inputSchema: pisGeneratorSchema,
  handler: generatePIS
};