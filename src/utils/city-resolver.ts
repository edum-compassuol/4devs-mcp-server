/**
 * City Resolver Utility
 * Resolves city names to city IDs using the 4Devs city loader API
 */

import { apiClient } from '../api/client.js';
import { CarregarCidadesRequest } from '../api/types.js';

export interface CityResolutionResult {
  cityId: number;
  cityName: string;
  exactMatch: boolean;
}

/**
 * Normalize text for comparison (remove accents, lowercase, trim)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents
}

/**
 * Calculate simple similarity score between two strings
 */
function calculateSimilarity(str1: string, str2: string): number {
  const norm1 = normalizeText(str1);
  const norm2 = normalizeText(str2);
  
  // Exact match
  if (norm1 === norm2) return 1.0;
  
  // Contains match
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.8;
  
  // Word match (split by spaces and check if any word matches)
  const words1 = norm1.split(/\s+/);
  const words2 = norm2.split(/\s+/);
  
  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1 === word2 && word1.length > 2) return 0.6;
    }
  }
  
  return 0.0;
}

/**
 * Resolve city name to city ID using the 4Devs API
 * @param cityName - Name of the city to search for
 * @param uf - Brazilian state UF code (e.g., 'SC', 'SP')
 * @returns Promise with city resolution result
 * @throws Error if city not found or multiple ambiguous matches
 */
export async function resolveCityByName(
  cityName: string, 
  uf: string
): Promise<CityResolutionResult> {
  console.error(`[City Resolver] Searching for city: "${cityName}" in ${uf}`);
  
  try {
    // 1. Load all cities for the state
    const request: CarregarCidadesRequest = {
      acao: 'carregar_cidades',
      cep_estado: uf.toUpperCase() as any // Type assertion for UF validation
    };
    
    const htmlResponse = await apiClient.makeRequest<string>(request);
    const cities = apiClient.parseCitiesHTML(htmlResponse);
    
    console.error(`[City Resolver] Found ${cities.length} cities in ${uf}`);
    
    if (cities.length === 0) {
      throw new Error(`No cities found for state ${uf}`);
    }
    
    // 2. Calculate similarity scores for all cities
    const cityScores = cities
      .map(city => ({
        ...city,
        similarity: calculateSimilarity(cityName, city.name)
      }))
      .filter(city => city.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity);
    
    console.error(`[City Resolver] Found ${cityScores.length} potential matches`);
    
    if (cityScores.length === 0) {
      // No matches found - provide helpful suggestions
      const suggestions = cities
        .slice(0, 5)
        .map(c => c.name)
        .join(', ');
      
      throw new Error(
        `City "${cityName}" not found in ${uf}. ` +
        `Available cities include: ${suggestions}...`
      );
    }
    
    const bestMatch = cityScores[0];
    
    // 3. Check for exact match
    if (bestMatch.similarity === 1.0) {
      console.error(`[City Resolver] Exact match found: "${bestMatch.name}" (ID: ${bestMatch.code})`);
      return {
        cityId: parseInt(bestMatch.code),
        cityName: bestMatch.name,
        exactMatch: true
      };
    }
    
    // 4. Check for high confidence match
    if (bestMatch.similarity >= 0.8) {
      // Check if there are other high-confidence matches
      const highConfidenceMatches = cityScores.filter(city => city.similarity >= 0.8);
      
      if (highConfidenceMatches.length === 1) {
        console.error(
          `[City Resolver] High confidence match found: "${bestMatch.name}" ` +
          `(ID: ${bestMatch.code}, similarity: ${bestMatch.similarity})`
        );
        return {
          cityId: parseInt(bestMatch.code),
          cityName: bestMatch.name,
          exactMatch: false
        };
      }
      
      // Multiple high-confidence matches - ambiguous
      const suggestions = highConfidenceMatches
        .slice(0, 5)
        .map(c => c.name)
        .join(', ');
      
      throw new Error(
        `Multiple cities match "${cityName}" in ${uf}. ` +
        `Please be more specific. Suggestions: ${suggestions}`
      );
    }
    
    // 5. Low confidence - provide suggestions
    const suggestions = cityScores
      .slice(0, 5)
      .map(c => c.name)
      .join(', ');
    
    throw new Error(
      `No close match found for "${cityName}" in ${uf}. ` +
      `Did you mean: ${suggestions}?`
    );
    
  } catch (error) {
    console.error(`[City Resolver] Error resolving city "${cityName}" in ${uf}:`, error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(`Failed to resolve city "${cityName}" in ${uf}: ${String(error)}`);
  }
}

/**
 * Validate that a city name resolution is possible
 * @param cityName - City name to validate
 * @param uf - State UF code
 * @returns boolean indicating if resolution is likely to succeed
 */
export function canResolveCityName(cityName: string, uf: string): boolean {
  // Basic validation
  if (!cityName || typeof cityName !== 'string') return false;
  if (!uf || typeof uf !== 'string') return false;
  if (cityName.trim().length < 2) return false;
  if (uf.trim().length !== 2) return false;
  
  return true;
}

/**
 * Get helpful error message for city resolution failures
 * @param cityName - Original city name
 * @param uf - State UF code
 * @param error - Original error
 * @returns User-friendly error message
 */
export function getCityResolutionErrorMessage(
  cityName: string, 
  uf: string, 
  error: Error
): string {
  if (error.message.includes('Multiple cities match')) {
    return error.message;
  }
  
  if (error.message.includes('not found')) {
    return error.message;
  }
  
  return `Unable to find city "${cityName}" in ${uf}. Please check the city name and state code.`;
}