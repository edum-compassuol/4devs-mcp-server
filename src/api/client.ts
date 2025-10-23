/**
 * 4Devs API Client
 * Handles HTTP requests to the 4Devs API with form-data encoding
 */

import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { APIRequest, APIResponse } from './types.js';

export class FourDevsAPIClient {
  private readonly baseURL = 'https://www.4devs.com.br';
  private readonly endpoint = '/ferramentas_online.php';

  /**
   * Makes a request to the 4Devs API
   * @param requestData - The request parameters
   * @returns Promise with the API response
   */
  async makeRequest<T extends APIResponse>(requestData: APIRequest): Promise<T> {
    console.error(`[API] Request to endpoint: ${this.endpoint}`);
    console.error(`[API] Action: ${requestData.acao}`);

    try {
      // Create form data
      const formData = new FormData();
      
      // Add all request parameters to form data
      Object.entries(requestData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // For document generation, force response as text to avoid number parsing
      const isDocumentGeneration = requestData.acao === 'gerador_certidao' ||
                                   requestData.acao === 'gerar_cnh' ||
                                   requestData.acao === 'gerar_pis' ||
                                   requestData.acao === 'gerar_titulo_eleitor';

      // Make the HTTP request
      const response: AxiosResponse = await axios.post(
        `${this.baseURL}${this.endpoint}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 30000, // 30 seconds timeout
          validateStatus: (status) => status < 500, // Accept 4xx errors for handling
          responseType: isDocumentGeneration ? 'text' : 'json'
        }
      );

      console.error(`[API] Response status: ${response.status}`);
      console.error(`[API] Response content-type: ${response.headers['content-type']}`);
      console.error(`[API] Response data type: ${typeof response.data}`);
      console.error(`[API] Response data preview: ${String(response.data).substring(0, 200)}`);

      // Handle different response types based on content-type
      if (response.headers['content-type']?.includes('application/json')) {
        return response.data as T;
      } else {
        // For HTML or text responses, return as string
        // Ensure we return the actual string content
        if (typeof response.data === 'string') {
          return response.data as T;
        } else {
          // If it's not a string, convert it to string
          return String(response.data) as T;
        }
      }

    } catch (error) {
      console.error(`[Error] API request failed:`, error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`API Error ${error.response.status}: ${error.response.statusText}`);
        } else if (error.request) {
          throw new Error('Network error: No response received from API');
        }
      }
      
      throw new Error(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse HTML city response to extract city codes and names
   * @param htmlResponse - HTML string with option tags
   * @returns Array of city objects
   */
  parseCitiesHTML(htmlResponse: string): Array<{ code: string; name: string }> {
    const cities: Array<{ code: string; name: string }> = [];
    
    // Simple regex to extract option values and text
    const optionRegex = /<option value="([^"]*)"[^>]*>([^<]*)<\/option>/gi;
    let match;
    
    while ((match = optionRegex.exec(htmlResponse)) !== null) {
      const code = match[1].trim();
      const name = match[2].trim();
      
      // Skip empty options
      if (code && name) {
        cities.push({ code, name });
      }
    }
    
    return cities;
  }

  /**
   * Validate UF code
   * @param uf - UF code to validate
   * @returns boolean indicating if UF is valid
   */
  isValidUF(uf: string): boolean {
    const validUFs = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
      'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];
    return validUFs.includes(uf.toUpperCase());
  }
}

// Export singleton instance
export const apiClient = new FourDevsAPIClient();