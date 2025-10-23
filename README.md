# 4Devs MCP Server

The 4Devs MCP Server connects AI tools directly to Brazilian document generation capabilities. This gives AI agents, assistants, and chatbots the ability to generate realistic Brazilian personal data, documents, and geographic information for testing and development purposes. All through natural language interactions.

[![Install with NPX](https://img.shields.io/badge/NPX-Install_Server-0098FF?style=flat-square&logo=npm&logoColor=white)](#install-with-npx) [![Install with Docker](https://img.shields.io/badge/Docker-Install_Server-2496ED?style=flat-square&logo=docker&logoColor=white)](#install-with-docker)

### Use Cases

- **Testing Data Generation**: Create realistic Brazilian personal data for application testing and development
- **Compliance Testing**: Generate valid Brazilian document formats (CPF, RG, CNH, PIS) for regulatory compliance testing
- **Development Workflows**: Seamless integration with AI development tools for Brazilian market applications
- **QA Automation**: Bulk generation of test datasets with proper Brazilian formatting and validation
- **Localization Support**: Geographic data and address generation for Brazilian applications
- **Document Validation**: Test document processing systems with valid Brazilian document numbers

Built for developers who want to connect their AI tools to Brazilian document generation capabilities, from simple natural language queries to complex multi-step agent workflows.

---

## Installation Methods

### Install with NPX

The NPX installation provides the quickest method for getting up and running locally.

#### Prerequisites

1. Node.js 18+ installed on your system
2. A compatible MCP host (Claude Desktop, VS Code with MCP support, etc.)

#### Quick Installation

```bash
# Run directly with NPX (recommended for testing)
npx 4devs-mcp-server

# Or install globally
npm install -g 4devs-mcp-server
```

#### Install in VS Code

Add the following JSON block to your VS Code MCP settings:

```json
{
  "mcpServers": {
    "4devs": {
      "command": "npx",
      "args": ["4devs-mcp-server"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

#### Install in Claude Desktop

Add to your Claude Desktop `settings.json`:

```json
{
  "mcpServers": {
    "4devs": {
      "command": "npx",
      "args": ["4devs-mcp-server"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Install with Docker

[![Install with Docker](https://img.shields.io/badge/Docker-Install_Server-2496ED?style=flat-square&logo=docker&logoColor=white)](#)

#### Prerequisites

1. [Docker](https://www.docker.com/) installed and running
2. A compatible MCP host with Docker support

#### Docker Installation

```bash
# Pull and run the Docker image
docker run -i --rm 4devs-mcp-server

# Or build from source
git clone <repository-url>
cd 4devs-mcp-server
docker build -t 4devs-mcp-server .
docker run -i --rm 4devs-mcp-server
```

#### Install with Docker in VS Code

```json
{
  "mcpServers": {
    "4devs": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "4devs-mcp-server"
      ],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

#### Install with Docker in Claude Desktop

```json
{
  "mcpServers": {
    "4devs": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "4devs-mcp-server"
      ],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Build from Source

If you prefer to build from source or contribute to the project:

```bash
# Clone the repository
git clone <repository-url>
cd 4devs-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Test the server
npm run inspector
```

Then configure your MCP client to use the built executable:

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

---

## Tools

The 4Devs MCP Server provides 6 comprehensive tools for Brazilian document generation:

<details>
<summary><b>Person Generator</b></summary>

- **gerar_pessoa** - Generate complete Brazilian person profiles
  - `sexo`: Gender selection - H (Male), M (Female), I (Random) (string, required)
  - `txt_qtde`: Number of people to generate (1-30) (number, required)
  - `pontuacao`: Include punctuation in documents - S (Yes), N (No) (string, optional)
  - `idade`: Specific age or 0 for random (0-120) (number, optional)
  - `cep_estado`: Brazilian state UF code (e.g., SC, SP) (string, optional)
  - `cep_cidade`: City code from city loader tool (number, optional)
  - `cidade_nome`: City name for automatic resolution (requires cep_estado, mutually exclusive with cep_cidade) (string, optional)

**Generates:**

- Personal information (name, age, gender, zodiac sign)
- Documents (CPF, RG with proper formatting)
- Family information (parents' names)
- Contact details (email, phone numbers)
- Address information (CEP, street, city, state)
- Physical characteristics (height, weight, blood type)
- Credentials (password generation)

**City Name Resolution Feature:**
The person generator supports automatic city name resolution. When you provide `cidade_nome`, the system will:

1. Load all cities for the specified state (`cep_estado`)
2. Search for the city using fuzzy matching (handles accents, case-insensitive)
3. Automatically resolve the city name to the required city ID
4. Generate person data specifically for that city

</details>

<details>
<summary><b>City Loader</b></summary>

- **carregar_cidades** - Load cities by Brazilian state
  - `cep_estado`: Brazilian state UF code (2 letters, e.g., SC, SP, RJ) (string, required)

**Returns:** Complete list of cities with codes and names for the specified state, used by the person generator for location-specific data generation.

</details>

<details>
<summary><b>Certificate Generator</b></summary>

- **gerador_certidao** - Generate Brazilian certificate numbers
  - `pontuacao`: Include punctuation formatting - S (Yes), N (No) (string, optional)
  - `tipo_certidao`: Certificate type (string, optional)
    - `nascimento`: Birth certificates
    - `casamento`: Marriage certificates
    - `casamento_religioso`: Religious marriage certificates
    - `obito`: Death certificates
    - `Indiferente`: Random certificate type

**Returns:** Valid Brazilian certificate numbers in the specified format.

</details>

<details>
<summary><b>CNH Generator</b></summary>

- **gerar_cnh** - Generate Brazilian CNH (driver's license) numbers
  - No parameters required

**Returns:** Valid 11-digit CNH number following Brazilian standards.

</details>

<details>
<summary><b>PIS Generator</b></summary>

- **gerar_pis** - Generate Brazilian PIS (social security) numbers
  - `pontuacao`: Include punctuation formatting - S (Yes), N (No) (string, optional)

**Returns:** Valid PIS number in format XXX.XXXXX.XX-X or numeric only.

</details>

<details>
<summary><b>Voter Registration Generator</b></summary>

- **gerar_titulo_eleitor** - Generate Brazilian voter registration numbers
  - `estado`: Brazilian state UF code (2 letters, e.g., SC, SP, RJ) (string, optional)

**Returns:** Valid 12-digit voter registration number, optionally targeted to a specific state.

</details>

---

## Resources

The server provides comprehensive resources for Brazilian geographic and documentation data:

### Brazilian Federal Units Resource

- **URI:** `uf://brazilian-states`
- **Type:** JSON data
- **Content:** Complete list of all 27 Brazilian Federal Units (states) with UF codes and full names

**Includes:**

- 26 States: AC, AL, AP, AM, BA, CE, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO
- 1 Federal District: DF

### Documentation Resource

- **URI:** `readme://documentation`
- **Type:** Markdown documentation
- **Content:** Complete server documentation including installation guides, tool descriptions, and usage examples

---

## Usage Examples

### Generate a Single Person

```bash
# Using MCP Inspector CLI
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call \
  --tool-name gerar_pessoa \
  --tool-arg sexo=M \
  --tool-arg txt_qtde=1
```

### Generate Multiple People from Specific State

```bash
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call \
  --tool-name gerar_pessoa \
  --tool-arg sexo=I \
  --tool-arg txt_qtde=5 \
  --tool-arg cep_estado=SP
```

### Generate People from Specific City (Enhanced Feature)

```bash
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

```bash
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call \
  --tool-name carregar_cidades \
  --tool-arg cep_estado=SC
```

### Generate Documents

```bash
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

### Access Resources

```bash
# Brazilian UF Resource
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method resources/read \
  --uri "uf://brazilian-states"

# Documentation Resource
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method resources/read \
  --uri "readme://documentation"
```

---

## Docker Usage

### Building the Docker Image

```bash
# Build the image
docker build -t 4devs-mcp-server .

# Or use npm script
npm run docker:build
```

### Running with Docker

```bash
# Run the container
docker run -i --rm 4devs-mcp-server

# Or use npm script
npm run docker:run

# Test the Docker build and run
npm run docker:test
```

### Docker Image Details

- **Base Image:** `node:22-alpine` (optimized for security and size)
- **Build Strategy:** Multi-stage build for minimal production image
- **Image Size:** ~50MB (optimized Node.js + application)
- **Security:** Non-root user, minimal attack surface
- **Architecture:** Supports multiple architectures (amd64, arm64)

---

## API Integration

The server integrates with the 4Devs API (`https://www.4devs.com.br/ferramentas_online.php`) using:

- **HTTP Method:** POST with multipart/form-data
- **Authentication:** None required (public API)
- **Rate Limiting:** Respectful usage recommended
- **Response Types:** JSON (person data), HTML (city lists), Text (documents)

---

## Development

### Project Structure

```
4devs-mcp-server/
├── Dockerfile                    # Multi-stage Docker build
├── .dockerignore                 # Docker ignore rules
├── src/
│   ├── index.ts                  # Main MCP server entry point
│   ├── api/
│   │   ├── client.ts             # 4Devs API client
│   │   └── types.ts              # TypeScript type definitions
│   ├── tools/                    # MCP tool implementations
│   │   ├── person-generator.ts
│   │   ├── city-loader.ts
│   │   ├── certificate-generator.ts
│   │   ├── cnh-generator.ts
│   │   ├── pis-generator.ts
│   │   └── voter-generator.ts
│   ├── resources/
│   │   ├── brazilian-states.ts   # Brazilian UF resource
│   │   └── documentation.ts      # Documentation resource
│   ├── utils/
│   │   ├── formatting.ts         # Response formatting utilities
│   │   ├── validation.ts         # Input validation helpers
│   │   └── city-resolver.ts      # City name resolution utilities
│   └── data/
│       └── brazilian-ufs.json    # Static Brazilian states data
├── build/                        # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

### Building and Testing

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes during development
npm run watch

# Test with MCP Inspector
npm run inspector

# Test Docker build
npm run docker:test
```

### Testing with MCP Inspector

```bash
# Interactive UI mode
npx @modelcontextprotocol/inspector node build/index.js

# CLI mode for automation
npx @modelcontextprotocol/inspector --cli node build/index.js --method tools/list
```

---

## Error Handling

The server implements robust error handling for:

- **Network Issues:** Connection timeouts and failures
- **API Errors:** Invalid responses and rate limiting
- **Validation Errors:** Invalid input parameters with clear messages
- **Data Processing:** Response parsing and formatting errors
- **City Resolution:** Fuzzy matching with helpful suggestions for invalid city names

All errors are returned in structured format with clear error messages and context information.

---

## Brazilian Geographic Data

### Supported States (UFs)

All 27 Brazilian Federal Units are supported:

**North Region:** AC, AM, AP, PA, RO, RR, TO  
**Northeast Region:** AL, BA, CE, MA, PB, PE, PI, RN, SE  
**Central-West Region:** DF, GO, MS, MT  
**Southeast Region:** ES, MG, RJ, SP  
**South Region:** PR, RS, SC  

### City Data

- Dynamic city loading via API (382 cities in SC, 645 cities in SP, etc.)
- City codes for precise geographic targeting
- Intelligent city name resolution with fuzzy matching
- Integration with person generator for location-specific data

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Build and test Docker image (`npm run docker:test`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add comprehensive error handling
- Include MCP protocol compliant logging
- Test all tools individually with MCP Inspector
- Update documentation for new features
- Maintain backward compatibility

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [4Devs](https://www.4devs.com.br/) for providing the Brazilian document generation API
- [Model Context Protocol](https://modelcontextprotocol.io/) for the standardized AI tool integration framework
- Brazilian government standards for document formatting specifications

---

## Support

For issues, questions, or contributions:

1. Check existing [GitHub issues](https://github.com/your-org/4devs-mcp-server/issues)
2. Create a new issue with detailed description
3. Include error logs and reproduction steps
4. Specify your MCP client and version
5. For Docker issues, include Docker version and platform information

---

## Changelog

### v1.2.0 (Docker + Documentation Enhancement)

- **New Feature**: Docker containerization with multi-stage builds
- **New Feature**: Documentation MCP resource (`readme://documentation`)
- **Enhancement**: GitHub MCP Server style README.md with comprehensive guides
- **Enhancement**: Multiple installation methods (NPX, Docker, Source)
- **Enhancement**: Enhanced package.json with proper metadata and Docker scripts
- **Enhancement**: Improved error handling and logging
- **Security**: Non-root Docker user and optimized Alpine Linux base image

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
