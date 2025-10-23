/**
 * City Loader Tool
 * Loads cities for a specific Brazilian state (UF)
 */

import { z } from 'zod';
import { apiClient } from '../api/client.js';
import { CarregarCidadesRequest, CarregarCidadesResponse, BrazilianUF } from '../api/types.js';
import { validateUF, createValidationError } from '../utils/validation.js';
import { formatSuccessResponse, formatErrorResponseForTool } from '../utils/formatting.js';

// Zod schema for input validation
export const cityLoaderSchema = z.object({
  cep_estado: z.string().length(2).describe('Brazilian state UF code (2 letters, e.g., SC, SP, RJ)')
});

export type CityLoaderInput = z.infer<typeof cityLoaderSchema>;

/**
 * Load cities for a specific UF using 4Devs API
 */
export async function loadCities(input: CityLoaderInput) {
  console.error('[Setup] Starting city loading...');
  
  try {
    // Validate input parameters
    const validatedInput = cityLoaderSchema.parse(input);
    
    // Validate UF code
    const ufCode = validatedInput.cep_estado.toUpperCase();
    if (!validateUF(ufCode)) {
      throw createValidationError('cep_estado', 'Must be a valid Brazilian UF code (e.g., SC, SP, RJ)');
    }

    // Prepare API request
    const apiRequest: CarregarCidadesRequest = {
      acao: 'carregar_cidades',
      cep_estado: ufCode as BrazilianUF
    };

    console.error(`[API] Loading cities for UF: ${ufCode}`);
    
    // Make API request
    const response = await apiClient.makeRequest<CarregarCidadesResponse>(apiRequest);
    
    // Validate response
    if (typeof response !== 'string') {
      throw new Error('Invalid response format: expected HTML string');
    }
    
    if (!response.includes('<option')) {
      throw new Error('No cities found or invalid response format');
    }

    // Parse HTML response to extract cities
    const cities = apiClient.parseCitiesHTML(response);
    
    console.error(`[API] Successfully loaded ${cities.length} cities for UF: ${ufCode}`);
    
    if (cities.length === 0) {
      throw new Error(`No cities found for UF: ${ufCode}`);
    }

    // Return formatted response with both raw HTML and parsed cities
    const result = {
      uf: ufCode,
      total_cities: cities.length,
      cities: cities,
      raw_html: response.substring(0, 500) + (response.length > 500 ? '...' : '') // Truncated for readability
    };

    return formatSuccessResponse(
      result,
      `Successfully loaded ${cities.length} cities for ${ufCode}`
    );

  } catch (error) {
    console.error('[Error] City loading failed:', error);
    
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return formatErrorResponseForTool(
        new Error(`Validation failed: ${validationErrors}`),
        'city-loader'
      );
    }
    
    return formatErrorResponseForTool(
      error instanceof Error ? error : new Error('Unknown error occurred'),
      'city-loader'
    );
  }
}

// Tool configuration for MCP server
export const cityLoaderTool = {
  name: 'carregar_cidades',
  description: 'Load all cities for a specific Brazilian state (UF). Returns city codes and names that can be used with the person generator tool for location-specific data generation.',
  inputSchema: cityLoaderSchema,
  handler: loadCities
};