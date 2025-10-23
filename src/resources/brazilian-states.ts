/**
 * Brazilian States Resource
 * Provides access to the complete list of Brazilian Federal Units (UFs)
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { UFData } from '../api/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load Brazilian UFs from JSON file
 */
export function loadBrazilianUFs(): UFData[] {
  try {
    const dataPath = join(__dirname, '../data/brazilian-ufs.json');
    const jsonData = readFileSync(dataPath, 'utf-8');
    return JSON.parse(jsonData) as UFData[];
  } catch (error) {
    console.error('[Error] Failed to load Brazilian UFs data:', error);
    // Return hardcoded fallback data
    return [
      { code: 'AC', name: 'Acre' },
      { code: 'AL', name: 'Alagoas' },
      { code: 'AP', name: 'Amapá' },
      { code: 'AM', name: 'Amazonas' },
      { code: 'BA', name: 'Bahia' },
      { code: 'CE', name: 'Ceará' },
      { code: 'DF', name: 'Distrito Federal' },
      { code: 'ES', name: 'Espírito Santo' },
      { code: 'GO', name: 'Goiás' },
      { code: 'MA', name: 'Maranhão' },
      { code: 'MT', name: 'Mato Grosso' },
      { code: 'MS', name: 'Mato Grosso do Sul' },
      { code: 'MG', name: 'Minas Gerais' },
      { code: 'PA', name: 'Pará' },
      { code: 'PB', name: 'Paraíba' },
      { code: 'PR', name: 'Paraná' },
      { code: 'PE', name: 'Pernambuco' },
      { code: 'PI', name: 'Piauí' },
      { code: 'RJ', name: 'Rio de Janeiro' },
      { code: 'RN', name: 'Rio Grande do Norte' },
      { code: 'RS', name: 'Rio Grande do Sul' },
      { code: 'RO', name: 'Rondônia' },
      { code: 'RR', name: 'Roraima' },
      { code: 'SC', name: 'Santa Catarina' },
      { code: 'SP', name: 'São Paulo' },
      { code: 'SE', name: 'Sergipe' },
      { code: 'TO', name: 'Tocantins' }
    ];
  }
}

/**
 * Get Brazilian UF resource content
 */
export function getBrazilianUFsResource(): string {
  const ufs = loadBrazilianUFs();
  return JSON.stringify({
    description: 'Complete list of Brazilian Federal Units (UFs)',
    total: ufs.length,
    states: ufs
  }, null, 2);
}

/**
 * Validate if a UF code exists
 */
export function isValidUFCode(code: string): boolean {
  const ufs = loadBrazilianUFs();
  return ufs.some(uf => uf.code === code.toUpperCase());
}

/**
 * Get UF name by code
 */
export function getUFName(code: string): string | null {
  const ufs = loadBrazilianUFs();
  const uf = ufs.find(uf => uf.code === code.toUpperCase());
  return uf ? uf.name : null;
}