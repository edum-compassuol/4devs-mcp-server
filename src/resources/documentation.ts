/**
 * Documentation Resource for 4Devs MCP Server
 * 
 * This resource provides access to the server's README.md documentation
 * through the MCP protocol, allowing clients to access comprehensive
 * documentation directly through the MCP interface.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the README.md content as a string
 * Reads the README.md file from the project root
 */
export function getDocumentationResource(): string {
  try {
    // Path to README.md from src/resources/ directory
    const readmePath = join(__dirname, '..', '..', 'README.md');
    const readmeContent = readFileSync(readmePath, 'utf-8');
    
    console.error('[API] Documentation resource accessed successfully');
    return readmeContent;
  } catch (error) {
    console.error('[Error] Failed to read documentation resource:', error);
    
    // Return a fallback documentation if README.md is not accessible
    return `# 4Devs MCP Server Documentation

## Error Loading Documentation

The README.md file could not be loaded. This is a fallback documentation.

## Available Tools

The 4Devs MCP Server provides 6 tools for Brazilian document generation:

1. **gerar_pessoa** - Generate complete person profiles
2. **carregar_cidades** - Load cities by Brazilian state
3. **gerador_certidao** - Generate Brazilian certificates
4. **gerar_cnh** - Generate CNH (driver's license) numbers
5. **gerar_pis** - Generate PIS (social security) numbers
6. **gerar_titulo_eleitor** - Generate voter registration numbers

## Available Resources

- **uf://brazilian-states** - Complete list of Brazilian Federal Units
- **readme://documentation** - This documentation resource

## Installation

\`\`\`bash
# NPX installation
npx 4devs-mcp-server

# Docker installation
docker run -i --rm 4devs-mcp-server
\`\`\`

For complete documentation, please check the README.md file in the project repository.
`;
  }
}

/**
 * Get documentation resource metadata
 */
export function getDocumentationResourceInfo() {
  return {
    uri: "readme://documentation",
    mimeType: "text/markdown",
    name: "4Devs MCP Server Documentation",
    description: "Complete documentation for the 4Devs MCP Server including installation, configuration, and usage examples"
  };
}