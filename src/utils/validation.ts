/**
 * Validation utilities for 4Devs MCP Server
 */

import { BrazilianUF } from '../api/types.js';

/**
 * Validate Brazilian UF code
 */
export function validateUF(uf: string): uf is BrazilianUF {
  const validUFs: BrazilianUF[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];
  return validUFs.includes(uf.toUpperCase() as BrazilianUF);
}

/**
 * Validate quantity for person generation (1-30)
 */
export function validateQuantity(qty: number): boolean {
  return Number.isInteger(qty) && qty >= 1 && qty <= 30;
}

/**
 * Validate age (0 for random, or positive integer)
 */
export function validateAge(age: number): boolean {
  return Number.isInteger(age) && age >= 0 && age <= 120;
}

/**
 * Validate punctuation option
 */
export function validatePunctuation(punct: string): punct is 'S' | 'N' {
  return punct === 'S' || punct === 'N';
}

/**
 * Validate gender option
 */
export function validateGender(gender: string): gender is 'H' | 'M' | 'I' {
  return gender === 'H' || gender === 'M' || gender === 'I';
}

/**
 * Validate certificate type
 */
export function validateCertificateType(type: string): type is 'nascimento' | 'casamento' | 'casamento_religioso' | 'obito' | 'Indiferente' {
  const validTypes = ['nascimento', 'casamento', 'casamento_religioso', 'obito', 'Indiferente'];
  return validTypes.includes(type);
}

/**
 * Validate city code (positive integer)
 */
export function validateCityCode(code: number): boolean {
  return Number.isInteger(code) && code > 0;
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: unknown): string {
  if (typeof input === 'string') {
    return input.trim();
  }
  return String(input || '').trim();
}

/**
 * Sanitize number input
 */
export function sanitizeNumber(input: unknown): number {
  if (typeof input === 'number') {
    return input;
  }
  const parsed = parseInt(String(input || '0'), 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Create validation error message
 */
export function createValidationError(field: string, expected: string): Error {
  return new Error(`Invalid ${field}: ${expected}`);
}