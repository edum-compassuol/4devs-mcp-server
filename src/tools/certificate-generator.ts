/**
 * Certificate Generator Tool
 * Generates Brazilian certificate numbers (birth, marriage, death, etc.)
 */

import { z } from 'zod';
import { apiClient } from '../api/client.js';
import { GeradorCertidaoRequest, GeradorCertidaoResponse } from '../api/types.js';
import { validatePunctuation, validateCertificateType, createValidationError } from '../utils/validation.js';
import { formatSuccessResponse, formatErrorResponseForTool } from '../utils/formatting.js';

// Zod schema for input validation
export const certificateGeneratorSchema = z.object({
  pontuacao: z.enum(['S', 'N']).optional().default('N').describe('Include punctuation: S (Yes), N (No)'),
  tipo_certidao: z.enum(['nascimento', 'casamento', 'casamento_religioso', 'obito', 'Indiferente']).optional().default('Indiferente').describe('Certificate type: nascimento (birth), casamento (marriage), casamento_religioso (religious marriage), obito (death), Indiferente (random)')
});

export type CertificateGeneratorInput = z.infer<typeof certificateGeneratorSchema>;

/**
 * Generate certificate number using 4Devs API
 */
export async function generateCertificate(input: CertificateGeneratorInput) {
  console.error('[Setup] Starting certificate generation...');
  
  try {
    // Validate input parameters
    const validatedInput = certificateGeneratorSchema.parse(input);

    // Prepare API request
    const apiRequest: GeradorCertidaoRequest = {
      acao: 'gerador_certidao'
    };

    // Add optional parameters
    if (validatedInput.pontuacao) {
      apiRequest.pontuacao = validatedInput.pontuacao;
    }
    
    if (validatedInput.tipo_certidao) {
      apiRequest.tipo_certidao = validatedInput.tipo_certidao;
    }

    console.error(`[API] Generating certificate of type: ${validatedInput.tipo_certidao} with punctuation: ${validatedInput.pontuacao}`);
    
    // Make API request
    const response = await apiClient.makeRequest<GeradorCertidaoResponse>(apiRequest);
    
    // Validate response
    if (typeof response !== 'string') {
      throw new Error('Invalid response format: expected string');
    }
    
    if (!response.trim()) {
      throw new Error('Empty certificate number generated');
    }

    const certificateNumber = response.trim();
    console.error(`[API] Successfully generated certificate: ${certificateNumber}`);
    console.error(`[API] Certificate number type: ${typeof certificateNumber}`);
    console.error(`[API] Certificate number length: ${certificateNumber.length}`);

    // Return formatted response
    const result = {
      certificate_type: validatedInput.tipo_certidao,
      punctuation: validatedInput.pontuacao,
      certificate_number: certificateNumber, // Keep as string to avoid scientific notation
      generated_at: new Date().toISOString()
    };

    return formatSuccessResponse(
      result,
      `Successfully generated ${validatedInput.tipo_certidao} certificate number`
    );

  } catch (error) {
    console.error('[Error] Certificate generation failed:', error);
    
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return formatErrorResponseForTool(
        new Error(`Validation failed: ${validationErrors}`),
        'certificate-generator'
      );
    }
    
    return formatErrorResponseForTool(
      error instanceof Error ? error : new Error('Unknown error occurred'),
      'certificate-generator'
    );
  }
}

// Tool configuration for MCP server
export const certificateGeneratorTool = {
  name: 'gerador_certidao',
  description: 'Generate Brazilian certificate numbers for various types including birth (nascimento), marriage (casamento), religious marriage (casamento_religioso), death (obito), or random type (Indiferente). Supports optional punctuation formatting.',
  inputSchema: certificateGeneratorSchema,
  handler: generateCertificate
};