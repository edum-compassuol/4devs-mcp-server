#!/usr/bin/env node

/**
 * 4Devs MCP Server
 * A Model Context Protocol server for Brazilian document generation using the 4Devs API
 * 
 * This server provides 6 tools for generating Brazilian documents and personal data:
 * - Person Generator: Complete person data with documents and address
 * - City Loader: Load cities by Brazilian state (UF)
 * - Certificate Generator: Generate various Brazilian certificates
 * - CNH Generator: Generate driver's license numbers
 * - PIS Generator: Generate social security numbers
 * - Voter Registration Generator: Generate voter registration numbers
 * 
 * Plus a Brazilian UF resource with all 27 Federal Units
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Import all tools
import { personGeneratorTool } from './tools/person-generator.js';
import { cityLoaderTool } from './tools/city-loader.js';
import { certificateGeneratorTool } from './tools/certificate-generator.js';
import { cnhGeneratorTool } from './tools/cnh-generator.js';
import { pisGeneratorTool } from './tools/pis-generator.js';
import { voterGeneratorTool } from './tools/voter-generator.js';

// Import resources
import { getBrazilianUFsResource } from './resources/brazilian-states.js';
import { getDocumentationResource, getDocumentationResourceInfo } from './resources/documentation.js';

/**
 * Create an MCP server with capabilities for tools and resources
 */
const server = new Server(
  {
    name: "4devs-mcp-server",
    version: "1.2.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

console.error("[Setup] Initializing 4Devs MCP Server...");

/**
 * Handler for listing available tools
 * Exposes all 6 Brazilian document generation tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error("[Setup] Listing available tools...");
  
  return {
    tools: [
      {
        name: personGeneratorTool.name,
        description: personGeneratorTool.description,
        inputSchema: {
          type: "object",
          properties: {
            sexo: { type: "string", enum: ["H", "M", "I"], default: "I", description: "Gender: H (Male), M (Female), I (Random)" },
            pontuacao: { type: "string", enum: ["S", "N"], default: "N", description: "Include punctuation in documents: S (Yes), N (No)" },
            idade: { type: "number", minimum: 0, maximum: 120, default: 0, description: "Age (0 for random)" },
            cep_estado: { type: "string", description: "Brazilian state UF code (e.g., SC, SP)" },
            txt_qtde: { type: "number", minimum: 1, maximum: 30, default: 1, description: "Number of people to generate (1-30)" },
            cep_cidade: { type: "number", minimum: 1, description: "City code (get from city loader tool)" },
            cidade_nome: { type: "string", description: "City name for automatic resolution (requires cep_estado, mutually exclusive with cep_cidade)" }
          },
          required: ["sexo", "txt_qtde"]
        }
      },
      {
        name: cityLoaderTool.name,
        description: cityLoaderTool.description,
        inputSchema: {
          type: "object",
          properties: {
            cep_estado: { type: "string", minLength: 2, maxLength: 2, description: "Brazilian state UF code (2 letters, e.g., SC, SP, RJ)" }
          },
          required: ["cep_estado"]
        }
      },
      {
        name: certificateGeneratorTool.name,
        description: certificateGeneratorTool.description,
        inputSchema: {
          type: "object",
          properties: {
            pontuacao: { type: "string", enum: ["S", "N"], default: "N", description: "Include punctuation: S (Yes), N (No)" },
            tipo_certidao: { type: "string", enum: ["nascimento", "casamento", "casamento_religioso", "obito", "Indiferente"], default: "Indiferente", description: "Certificate type" }
          }
        }
      },
      {
        name: cnhGeneratorTool.name,
        description: cnhGeneratorTool.description,
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: pisGeneratorTool.name,
        description: pisGeneratorTool.description,
        inputSchema: {
          type: "object",
          properties: {
            pontuacao: { type: "string", enum: ["S", "N"], default: "N", description: "Include punctuation: S (Yes), N (No)" }
          }
        }
      },
      {
        name: voterGeneratorTool.name,
        description: voterGeneratorTool.description,
        inputSchema: {
          type: "object",
          properties: {
            estado: { type: "string", minLength: 2, maxLength: 2, description: "Brazilian state UF code (2 letters, e.g., SC, SP, RJ) - optional" }
          }
        }
      }
    ]
  };
});

/**
 * Handler for calling tools
 * Routes tool calls to the appropriate handler
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  console.error(`[API] Tool called: ${name}`);
  
  try {
    switch (name) {
      case personGeneratorTool.name:
        return await personGeneratorTool.handler(args as any);
      
      case cityLoaderTool.name:
        return await cityLoaderTool.handler(args as any);
      
      case certificateGeneratorTool.name:
        return await certificateGeneratorTool.handler(args as any);
      
      case cnhGeneratorTool.name:
        return await cnhGeneratorTool.handler(args as any);
      
      case pisGeneratorTool.name:
        return await pisGeneratorTool.handler(args as any);
      
      case voterGeneratorTool.name:
        return await voterGeneratorTool.handler(args as any);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`[Error] Tool execution failed for ${name}:`, error);
    throw error;
  }
});

/**
 * Handler for listing available resources
 * Exposes the Brazilian UF resource
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  console.error("[Setup] Listing available resources...");
  
  return {
    resources: [
      {
        uri: "uf://brazilian-states",
        mimeType: "application/json",
        name: "Brazilian Federal Units (UFs)",
        description: "Complete list of all 27 Brazilian Federal Units (states) with codes and names"
      },
      getDocumentationResourceInfo()
    ]
  };
});

/**
 * Handler for reading resources
 * Provides access to the Brazilian UF resource
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  console.error(`[API] Resource requested: ${uri}`);
  
  if (uri === "uf://brazilian-states") {
    return {
      contents: [
        {
          uri: uri,
          mimeType: "application/json",
          text: getBrazilianUFsResource()
        }
      ]
    };
  }
  
  if (uri === "readme://documentation") {
    return {
      contents: [
        {
          uri: uri,
          mimeType: "text/markdown",
          text: getDocumentationResource()
        }
      ]
    };
  }
  
  throw new Error(`Unknown resource: ${uri}`);
});

/**
 * Start the server using stdio transport
 * This allows the server to communicate via standard input/output streams
 */
async function main() {
  console.error("[Setup] Starting 4Devs MCP Server...");
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("[Setup] 4Devs MCP Server is running and ready to accept requests");
  console.error("[Setup] Available tools: gerar_pessoa, carregar_cidades, gerador_certidao, gerar_cnh, gerar_pis, gerar_titulo_eleitor");
  console.error("[Setup] Available resources: uf://brazilian-states, readme://documentation");
}

main().catch((error) => {
  console.error("[Error] Server startup failed:", error);
  process.exit(1);
});
