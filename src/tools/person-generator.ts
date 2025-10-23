/**
 * Person Generator Tool
 * Generates complete Brazilian person data including documents, address, and personal information
 */

import { z } from 'zod';
import { apiClient } from '../api/client.js';
import { GeradorPessoaRequest, GeradorPessoaResponse, BrazilianUF } from '../api/types.js';
import { validateUF, validateQuantity, validateAge, validateGender, validatePunctuation, validateCityCode, sanitizeString, sanitizeNumber, createValidationError } from '../utils/validation.js';
import { formatSuccessResponse, formatErrorResponseForTool } from '../utils/formatting.js';

// Zod schema for input validation
export const personGeneratorSchema = z.object({
  sexo: z.enum(['H', 'M', 'I']).default('I').describe('Gender: H (Male), M (Female), I (Random)'),
  pontuacao: z.enum(['S', 'N']).optional().default('N').describe('Include punctuation in documents: S (Yes), N (No)'),
  idade: z.number().int().min(0).max(120).optional().default(0).describe('Age (0 for random)'),
  cep_estado: z.string().optional().describe('Brazilian state UF code (e.g., SC, SP)'),
  txt_qtde: z.number().int().min(1).max(30).default(1).describe('Number of people to generate (1-30)'),
  cep_cidade: z.number().int().positive().optional().describe('City code (get from city loader tool)')
});

export type PersonGeneratorInput = z.infer<typeof personGeneratorSchema>;

/**
 * Generate person data using 4Devs API
 */
export async function generatePerson(input: PersonGeneratorInput) {
  console.error('[Setup] Starting person generation...');
  
  try {
    // Validate input parameters
    const validatedInput = personGeneratorSchema.parse(input);
    
    // Additional validation
    if (validatedInput.cep_estado && !validateUF(validatedInput.cep_estado)) {
      throw createValidationError('cep_estado', 'Must be a valid Brazilian UF code');
    }
    
    if (validatedInput.cep_cidade && validatedInput.cep_cidade <= 0) {
      throw createValidationError('cep_cidade', 'Must be a positive integer');
    }
    
    // If cep_cidade is provided, cep_estado must also be provided
    if (validatedInput.cep_cidade && !validatedInput.cep_estado) {
      throw createValidationError('cep_estado', 'Required when cep_cidade is specified');
    }

    // Prepare API request
    const apiRequest: GeradorPessoaRequest = {
      acao: 'gerar_pessoa',
      sexo: validatedInput.sexo,
      txt_qtde: validatedInput.txt_qtde
    };

    // Add optional parameters
    if (validatedInput.pontuacao) {
      apiRequest.pontuacao = validatedInput.pontuacao;
    }
    
    if (validatedInput.idade && validatedInput.idade > 0) {
      apiRequest.idade = validatedInput.idade;
    }
    
    if (validatedInput.cep_estado) {
      apiRequest.cep_estado = validatedInput.cep_estado.toUpperCase() as BrazilianUF;
    }
    
    if (validatedInput.cep_cidade) {
      apiRequest.cep_cidade = validatedInput.cep_cidade;
    }

    console.error(`[API] Generating ${validatedInput.txt_qtde} person(s) with gender: ${validatedInput.sexo}`);
    
    // Make API request
    const response = await apiClient.makeRequest<GeradorPessoaResponse>(apiRequest);
    
    console.error(`[API] Successfully generated ${Array.isArray(response) ? response.length : 1} person(s)`);
    
    // Validate response
    if (!Array.isArray(response)) {
      throw new Error('Invalid response format: expected array of persons');
    }
    
    if (response.length === 0) {
      throw new Error('No person data generated');
    }

    // Return formatted response
    return formatSuccessResponse(
      response,
      `Successfully generated ${response.length} person(s) with complete Brazilian data`
    );

  } catch (error) {
    console.error('[Error] Person generation failed:', error);
    
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return formatErrorResponseForTool(
        new Error(`Validation failed: ${validationErrors}`),
        'person-generator'
      );
    }
    
    return formatErrorResponseForTool(
      error instanceof Error ? error : new Error('Unknown error occurred'),
      'person-generator'
    );
  }
}

// Tool configuration for MCP server
export const personGeneratorTool = {
  name: 'gerar_pessoa',
  description: 'Generate complete Brazilian person data including name, documents (CPF, RG), address, contact information, and personal details. Supports batch generation of 1-30 people with customizable options.',
  inputSchema: personGeneratorSchema,
  handler: generatePerson
};