# 4Devs MCP Server

A Model Context Protocol (MCP) server that provides seamless integration with the 4Devs Brazilian document generation API. This server enables AI tools and applications to generate realistic Brazilian personal data, documents, and geographic information for testing and development purposes.

## Overview

The 4Devs MCP Server bridges the gap between the 4Devs web service and modern AI development workflows, providing standardized access to Brazilian document generation capabilities through the MCP protocol.

### Key Features

- **6 Comprehensive Tools** for Brazilian document generation
- **Brazilian Geographic Data** with all 27 Federal Units (UFs)
- **Batch Generation** support (1-30 records)
- **Flexible Formatting** options (with/without punctuation)
- **Complete MCP Compliance** with JSON Schema validation
- **Robust Error Handling** and comprehensive logging
- **TypeScript Implementation** with full type safety

## Available Tools

### 1. Person Generator (`gerar_pessoa`)

Generates complete Brazilian person profiles including:

- Personal information (name, age, gender, zodiac sign)
- Documents (CPF, RG with proper formatting)
- Family information (parents' names)
- Contact details (email, phone numbers)
- Address information (CEP, street, city, state)
- Physical characteristics (height, weight, blood type)
- Credentials (password generation)

**Parameters:**

- `sexo`: Gender selection (H=Male, M=Female, I=Random)
- `txt_qtde`: Number of people to generate (1-30)
- `pontuacao`: Include punctuation in documents (S/N)
- `idade`: Specific age or 0 for random
- `cep_estado`: Brazilian state UF code (optional)
- `cep_cidade`: City code from city loader (optional)
- `cidade_nome`: City name for automatic resolution (requires cep_estado, mutually exclusive with cep_cidade)

**City Name Resolution:**

The person generator now supports automatic city name resolution. When you provide `cidade_nome`, the system will:

1. Load all cities for the specified state (`cep_estado`)
2. Search for the city using fuzzy matching (handles accents, case-insensitive)
3. Automatically resolve the city name to the required city ID
4. Generate person data specifically for that city

This eliminates the need to manually look up city codes, making the tool much more user-friendly.

**Examples:**
- `cidade_nome: "Florianópolis"` with `cep_estado: "SC"` → Generates people from Florianópolis
- `cidade_nome: "São Paulo"` with `cep_estado: "SP"` → Generates people from São Paulo
- Invalid city names provide helpful error messages with suggestions

### 2. City Loader (`carregar_cidades`)

Loads all cities for a specific Brazilian state.

**Parameters:**

- `cep_estado`: Brazilian state UF code (required)

**Returns:** List of cities with codes and names for the specified state.

### 3. Certificate Generator (`gerador_certidao`)

Generates Brazilian certificate numbers for various document types.

**Parameters:**

- `tipo_certidao`: Certificate type (nascimento, casamento, casamento_religioso, obito, Indiferente)
- `pontuacao`: Include punctuation formatting (S/N)

**Supported Types:**

- `nascimento`: Birth certificates
- `casamento`: Marriage certificates  
- `casamento_religioso`: Religious marriage certificates
- `obito`: Death certificates
- `Indiferente`: Random certificate type

### 4. CNH Generator (`gerar_cnh`)

Generates valid Brazilian CNH (driver's license) numbers.

**Parameters:** None required

**Returns:** 11-digit CNH number following Brazilian standards.

### 5. PIS Generator (`gerar_pis`)

Generates valid Brazilian PIS (social security) numbers.

**Parameters:**

- `pontuacao`: Include punctuation formatting (S/N)

**Returns:** PIS number in format XXX.XXXXX.XX-X or numeric only.

### 6. Voter Registration Generator (`gerar_titulo_eleitor`)

Generates valid Brazilian voter registration numbers.

**Parameters:**

- `estado`: Brazilian state UF code (optional)

**Returns:** 12-digit voter registration number.

## Brazilian UF Resource

The server provides a comprehensive resource containing all 27 Brazilian Federal Units:

**URI:** `uf://brazilian-states`

**Content:** Complete list of Brazilian states with UF codes and full names, including:

- 26 States: AC, AL, AP, AM, BA, CE, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO
- 1 Federal District: DF

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- MCP-compatible client (Claude Desktop, etc.)

### Setup

1. **Clone or download the server:**

```bash
git clone <repository-url>
cd 4devs-mcp-server
```

2. **Install dependencies:**

```bash
npm install
```

3. **Build the server:**

```bash
npm run build
```

4. **Test the server:**

```bash
npm test
```

## Configuration

### MCP Client Configuration

Add the server to your MCP client configuration:

#### For Claude Desktop (settings.json)

```json
{
  "mcpServers": {
    "4devs": {
      "command": "node",
      "args": ["path/to/4devs-mcp-server/build/index.js"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

#### For other MCP clients

```json
{
  "name": "4devs",
  "command": "node",
  "args": ["build/index.js"],
  "cwd": "/path/to/4devs-mcp-server"
}
```

## Usage Examples

### Generate a Single Person

```typescript
// Using MCP Inspector CLI
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call \
  --tool-name gerar_pessoa \
  --tool-arg sexo=M \
  --tool-arg txt_qtde=1
```

### Generate Multiple People from Specific State

```typescript
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call \
  --tool-name gerar_pessoa \
  --tool-arg sexo=I \
  --tool-arg txt_qtde=5 \
  --tool-arg cep_estado=SP
```

### Generate People from Specific City (New Feature)

```typescript
# Generate person from Florianópolis, SC
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call \
  --tool-name gerar_pessoa \
  --tool-arg sexo=M \
  --tool-arg txt_qtde=1 \
  --tool-arg cep_estado=SC \
  --tool-arg cidade_nome=Florianópolis

# Generate people from São Paulo, SP
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call \
  --tool-name gerar_pessoa \
  --tool-arg sexo=I \
  --tool-arg txt_qtde=3 \
  --tool-arg cep_estado=SP \
  --tool-arg cidade_nome="São Paulo"
```

### Load Cities for a State

```typescript
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call \
  --tool-name carregar_cidades \
  --tool-arg cep_estado=SC
```

### Generate Documents

```typescript
# Birth certificate with punctuation
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call \
  --tool-name gerador_certidao \
  --tool-arg tipo_certidao=nascimento \
  --tool-arg pontuacao=S

# CNH number
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call \
  --tool-name gerar_cnh

# PIS with punctuation
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call \
  --tool-name gerar_pis \
  --tool-arg pontuacao=S
```

### Access Brazilian UF Resource

```typescript
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method resources/read \
  --uri "uf://brazilian-states"
```

## API Integration

The server integrates with the 4Devs API (`https://www.4devs.com.br/ferramentas_online.php`) using:

- **HTTP Method:** POST with multipart/form-data
- **Authentication:** None required (public API)
- **Rate Limiting:** Respectful usage recommended
- **Response Types:** JSON (person data), HTML (city lists), Text (documents)

## Development

### Project Structure

```txt
4devs-mcp-server/
├── src/
│   ├── index.ts              # Main MCP server entry point
│   ├── api/
│   │   ├── client.ts         # 4Devs API client
│   │   └── types.ts          # TypeScript type definitions
│   ├── tools/                # MCP tool implementations
│   │   ├── person-generator.ts
│   │   ├── city-loader.ts
│   │   ├── certificate-generator.ts
│   │   ├── cnh-generator.ts
│   │   ├── pis-generator.ts
│   │   └── voter-generator.ts
│   ├── resources/
│   │   └── brazilian-states.ts # Brazilian UF resource
│   ├── utils/
│   │   ├── formatting.ts     # Response formatting utilities
│   │   ├── validation.ts     # Input validation helpers
│   │   └── city-resolver.ts  # City name resolution utilities
│   └── data/
│       └── brazilian-ufs.json # Static Brazilian states data
├── build/                    # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Testing with MCP Inspector

```bash
# Interactive UI mode
npx @modelcontextprotocol/inspector node build/index.js

# CLI mode for automation
npx @modelcontextprotocol/inspector --cli node build/index.js --method tools/list
```

### Logging

The server provides comprehensive logging following MCP development protocol:

- `[Setup]` - Server initialization
- `[API]` - API requests and responses  
- `[Error]` - Error conditions and failures

## Error Handling

The server implements robust error handling for:

- **Network Issues:** Connection timeouts and failures
- **API Errors:** Invalid responses and rate limiting
- **Validation Errors:** Invalid input parameters
- **Data Processing:** Response parsing and formatting errors

All errors are returned in structured format with clear error messages and context information.

## Brazilian Geographic Data

### Supported States (UFs)

All 27 Brazilian Federal Units are supported:

**North Region:** AC, AM, AP, PA, RO, RR, TO  
**Northeast Region:** AL, BA, CE, MA, PB, PE, PI, RN, SE  
**Central-West Region:** DF, GO, MS, MT  
**Southeast Region:** ES, MG, RJ, SP  
**South Region:** PR, RS, SC  

### City Data

- Dynamic city loading via API
- City codes for precise geographic targeting
- Integration with person generator for location-specific data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [4Devs](https://www.4devs.com.br/) for providing the Brazilian document generation API
- [Model Context Protocol](https://modelcontextprotocol.io/) for the standardized AI tool integration framework
- Brazilian government standards for document formatting specifications

## Support

For issues, questions, or contributions:

1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and reproduction steps
4. Specify your MCP client and version

## Changelog

### v1.1.0 (City Name Resolution Update)

- **New Feature**: Automatic city name resolution in person generator
- Added `cidade_nome` parameter to `gerar_pessoa` tool
- Intelligent fuzzy matching for city names (handles accents, case-insensitive)
- Comprehensive error messages with city suggestions
- Mutual exclusivity validation between `cidade_nome` and `cep_cidade`
- Enhanced user experience - no need to look up city codes manually

### v1.0.0 (Initial Release)

- Complete implementation of 6 MCP tools
- Brazilian UF resource with all 27 Federal Units
- Full MCP protocol compliance
- Comprehensive error handling and logging
- TypeScript implementation with type safety
- Scientific notation fix for large certificate numbers
- Batch generation support (1-30 people)
- Geographic targeting by state and city
- Punctuation formatting options for documents
