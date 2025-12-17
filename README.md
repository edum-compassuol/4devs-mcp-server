# 4Devs MCP Server

Um servidor MCP (Model Context Protocol) que integra com a API 4Devs para geração de documentos e dados brasileiros válidos para testes e desenvolvimento.

## 📋 Visão Geral

O 4Devs MCP Server fornece acesso programático à API 4Devs através do protocolo MCP, permitindo que assistentes de IA e outras ferramentas gerem dados brasileiros realistas incluindo:

- Dados pessoais completos (nome, idade, documentos, endereço)
- Documentos brasileiros válidos (CPF, RG, CNH, PIS, Certidões, Título de Eleitor)
- Dados geográficos (estados e cidades brasileiras)

## ✨ Funcionalidades

### 6 Ferramentas Disponíveis

1. **gerar_pessoa** - Gera dados completos de pessoas
2. **carregar_cidades** - Lista cidades por estado (UF)
3. **gerador_certidao** - Gera números de certidões
4. **gerar_cnh** - Gera números de CNH (Carteira Nacional de Habilitação)
5. **gerar_pis** - Gera números de PIS
6. **gerar_titulo_eleitor** - Gera números de Título de Eleitor

## 🚀 Instalação

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

### Instalação Local

```bash
# Clone o repositório
git clone <repository-url>
cd 4devs-mcp-server

# Instale as dependências
npm install

# Compile o projeto
npm run build
```

## ⚙️ Configuração

### Claude Desktop

Adicione ao arquivo de configuração do Claude Desktop (`claude_desktop_config.json`):

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "4devs": {
      "command": "node",
      "args": ["/caminho/completo/para/4devs-mcp-server/build/index.js"]
    }
  }
}
```

### Outros Clientes MCP

Para outros clientes que suportam MCP, use o transporte stdio:

```json
{
  "command": "node",
  "args": ["/caminho/para/build/index.js"],
  "transport": "stdio"
}
```

## 📖 Uso

### 1. Gerar Pessoa

Gera dados completos de uma ou mais pessoas brasileiras.

**Parâmetros:**

- `sexo` (obrigatório): "H" (Homem), "M" (Mulher), ou "I" (Indiferente/Aleatório)
- `txt_qtde` (obrigatório): Quantidade de pessoas (1-30)
- `pontuacao` (opcional): "S" para incluir pontuação nos documentos, "N" para não incluir
- `idade` (opcional): Idade específica ou 0 para aleatória
- `cep_estado` (opcional): UF do estado (ex: "SP", "RJ", "SC")
- `cep_cidade` (opcional): Código da cidade (obter via `carregar_cidades`)

**Exemplo de Requisição:**

```json
{
  "name": "gerar_pessoa",
  "arguments": {
    "sexo": "I",
    "txt_qtde": 2,
    "pontuacao": "S",
    "cep_estado": "SP"
  }
}
```

**Exemplo de Resposta:**

```json
[
  {
    "nome": "João Silva Santos",
    "idade": 35,
    "cpf": "123.456.789-00",
    "rg": "12.345.678-9",
    "data_nasc": "15/03/1989",
    "sexo": "Masculino",
    "signo": "Peixes",
    "mae": "Maria Silva",
    "pai": "José Santos",
    "email": "joao.silva@example.com",
    "senha": "abc123XYZ",
    "cep": "01234-567",
    "endereco": "Rua Exemplo 123",
    "numero": 456,
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "telefone_fixo": "(11) 1234-5678",
    "celular": "(11) 98765-4321",
    "altura": "1,75",
    "peso": 80,
    "tipo_sanguineo": "O+",
    "cor": "azul"
  }
]
```

### 2. Carregar Cidades

Lista todas as cidades de um estado brasileiro.

**Parâmetros:**

- `cep_estado` (obrigatório): Sigla do estado (ex: "SP", "RJ", "SC")

**Exemplo de Requisição:**

```json
{
  "name": "carregar_cidades",
  "arguments": {
    "cep_estado": "SC"
  }
}
```

**Exemplo de Resposta:**

```json
{
  "estado": "SC",
  "total_cidades": 295,
  "cidades": [
    {
      "code": 8319,
      "name": "Abdon Batista"
    },
    {
      "code": 8320,
      "name": "Abelardo Luz"
    }
  ]
}
```

### 3. Gerador de Certidão

Gera números de certidões brasileiras.

**Parâmetros:**

- `pontuacao` (opcional): "S" para incluir pontuação, "N" para não incluir
- `tipo_certidao` (opcional): "nascimento", "casamento", "casamento_religioso", "obito", ou "Indiferente"

**Exemplo de Requisição:**

```json
{
  "name": "gerador_certidao",
  "arguments": {
    "tipo_certidao": "nascimento",
    "pontuacao": "S"
  }
}
```

**Exemplo de Resposta:**

```json
{
  "tipo_certidao": "nascimento",
  "numero": "123456 01 55 2020 1 12345 678 1234567-89"
}
```

### 4. Gerar CNH

Gera números de CNH (Carteira Nacional de Habilitação).

**Parâmetros:** Nenhum

**Exemplo de Requisição:**

```json
{
  "name": "gerar_cnh",
  "arguments": {}
}
```

**Exemplo de Resposta:**

```json
{
  "cnh": "12345678901"
}
```

### 5. Gerar PIS

Gera números de PIS (Programa de Integração Social).

**Parâmetros:**

- `pontuacao` (opcional): "S" para incluir pontuação, "N" para não incluir

**Exemplo de Requisição:**

```json
{
  "name": "gerar_pis",
  "arguments": {
    "pontuacao": "S"
  }
}
```

**Exemplo de Resposta:**

```json
{
  "pis": "123.45678.90-1"
}
```

### 6. Gerar Título de Eleitor

Gera números de Título de Eleitor.

**Parâmetros:**

- `estado` (opcional): UF do estado (ex: "SP", "RJ", "SC")

**Exemplo de Requisição:**

```json
{
  "name": "gerar_titulo_eleitor",
  "arguments": {
    "estado": "SP"
  }
}
```

**Exemplo de Resposta:**

```json
{
  "estado": "SP",
  "titulo_eleitor": "123456789012"
}
```

## 🧪 Testes

### Testar com Script Customizado

```bash
npm run build
node test-tools.js
```

### Testar com MCP Inspector

```bash
npm run inspector
```

O MCP Inspector abrirá uma interface web em `http://localhost:6274` onde você pode testar todas as ferramentas interativamente.

## 🏗️ Estrutura do Projeto

```txt
4devs-mcp-server/
├── src/
│   ├── api/
│   │   ├── client.ts          # Cliente HTTP para API 4Devs
│   │   └── types.ts           # Tipos TypeScript
│   ├── schemas/
│   │   └── tool-schemas.ts    # Schemas Zod para validação
│   ├── tools/
│   │   ├── gerar-pessoa.ts
│   │   ├── carregar-cidades.ts
│   │   ├── gerador-certidao.ts
│   │   ├── gerar-cnh.ts
│   │   ├── gerar-pis.ts
│   │   └── gerar-titulo-eleitor.ts
│   ├── server.ts              # Implementação do servidor MCP
│   └── index.ts               # Ponto de entrada
├── build/                     # Código compilado
├── test-tools.js              # Script de testes
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Compilar o projeto
npm run build

# Iniciar o servidor (após compilar)
npm start

# Modo desenvolvimento com watch
npm run dev

# Abrir MCP Inspector
npm run inspector
```

### Adicionar Nova Ferramenta

1. Crie um novo arquivo em `src/tools/`
2. Implemente a interface `Tool` do MCP SDK
3. Adicione o schema Zod em `src/schemas/tool-schemas.ts`
4. Registre a ferramenta em `src/server.ts`

## 📚 Referências

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [4Devs API](https://www.4devs.com.br/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## ⚠️ Avisos

- Este servidor é destinado apenas para fins de teste e desenvolvimento
- Os dados gerados são fictícios mas seguem formatos válidos brasileiros
- Não use dados gerados para fins fraudulentos ou ilegais
- A API 4Devs é um serviço de terceiros e pode ter limitações de uso

## 🐛 Problemas Conhecidos

- O script de teste (`test-tools.js`) mostra "timeout" mas os testes funcionam corretamente
- A API 4Devs pode retornar tipos de resposta variados (string ou objeto) para alguns endpoints

## 📞 Suporte

Para problemas ou dúvidas:

- Abra uma issue no GitHub
- Consulte a documentação do MCP
- Verifique a documentação da API 4Devs
