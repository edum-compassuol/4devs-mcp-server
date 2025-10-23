/**
 * Voter Registration Generator Tool
 * Generates Brazilian voter registration (título de eleitor) numbers
 */

import { z } from 'zod';
import { apiClient } from '../api/client.js';
import { GeradorTituloEleitorRequest, GeradorTituloEleitorResponse, BrazilianUF } from '../api/types.js';
import { validateUF, createValidationError } from '../utils/validation.js';
import { formatSuccessResponse, formatErrorResponseForTool } from '../utils/formatting.js';

// Zod schema for input validation
export const voterGeneratorSchema = z.object({
  estado: z.string().length(2).optional().describe('Brazilian state UF code (2 letters, e.g., SC, SP, RJ) - optional for state-specific voter registration')
});

export type VoterGeneratorInput = z.infer<typeof voterGeneratorSchema>;

/**
 * Generate voter registration number using 4Devs API
 */
export async function generateVoterRegistration(input: VoterGeneratorInput) {
  console.error('[Setup] Starting voter registration generation...');
  
  try {
    // Validate input parameters
    const validatedInput = voterGeneratorSchema.parse(input);

    // Validate UF code if provided
    let ufCode: BrazilianUF | undefined;
    if (validatedInput.estado) {
      ufCode = validatedInput.estado.toUpperCase() as BrazilianUF;
      if (!validateUF(ufCode)) {
        throw createValidationError('estado', 'Must be a valid Brazilian UF code (e.g., SC, SP, RJ)');
      }
    }

    // Prepare API request
    const apiRequest: GeradorTituloEleitorRequest = {
      acao: 'gerar_titulo_eleitor'
    };

    // Add optional UF parameter
    if (ufCode) {
      apiRequest.estado = ufCode;
    }

    console.error(`[API] Generating voter registration${ufCode ? ` for UF: ${ufCode}` : ' (random state)'}`);
    
    // Make API request
    const response = await apiClient.makeRequest<GeradorTituloEleitorResponse>(apiRequest);
    
    // Validate response
    if (typeof response !== 'string') {
      throw new Error('Invalid response format: expected string');
    }
    
    if (!response.trim()) {
      throw new Error('Empty voter registration number generated');
    }

    const voterNumber = response.trim();
    
    // Validate voter registration format (should be 12 digits)
    if (!/^\d{12}$/.test(voterNumber)) {
      console.error(`[Warning] Voter registration number may have unexpected format: ${voterNumber}`);
    }

    console.error(`[API] Successfully generated voter registration: ${voterNumber}`);

    // Return formatted response
    const result = {
      document_type: 'Título de Eleitor',
      voter_registration_number: voterNumber,
      state: ufCode || 'Random',
      format: 'Numeric only (12 digits)',
      generated_at: new Date().toISOString()
    };

    return formatSuccessResponse(
      result,
      `Successfully generated Brazilian voter registration number${ufCode ? ` for ${ufCode}` : ''}`
    );

  } catch (error) {
    console.error('[Error] Voter registration generation failed:', error);
    
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return formatErrorResponseForTool(
        new Error(`Validation failed: ${validationErrors}`),
        'voter-generator'
      );
    }
    
    return formatErrorResponseForTool(
      error instanceof Error ? error : new Error('Unknown error occurred'),
      'voter-generator'
    );
  }
}

// Tool configuration for MCP server
export const voterGeneratorTool = {
  name: 'gerar_titulo_eleitor',
  description: 'Generate a valid Brazilian voter registration number (Título de Eleitor). Optionally specify a state (UF) for state-specific generation, or leave empty for random state selection. Returns a 12-digit numeric code.',
  inputSchema: voterGeneratorSchema,
  handler: generateVoterRegistration
};