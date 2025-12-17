# 📦 Plano de Deploy - 4Devs MCP Server

## Informações do Usuário Github

- **Username:** edum-compassuol
- **Nome:** Eduardo Sausen Mallmann
- **Email:** eduardo.sausen@compasso.com.br
- **Empresa:** Compass UOL
- **Localização:** Florianópolis, Brazil
- **Profile URL:** https://github.com/edum-compassuol

---

## 🎯 Objetivo

Realizar o deploy do MCP Server 4Devs no Github Packages, publicando:
1. Pacote NPM no Github Packages
2. Imagem Docker no Github Container Registry

---

## 📋 Checklist de Deploy

### Fase 1: Preparação do Repositório

- [ ] 1.1. Criar repositório remoto no Github usando Github MCP Server
- [ ] 1.2. Adicionar repositório remoto ao git local
- [ ] 1.3. Atualizar package.json com informações de deploy
- [ ] 1.4. Criar arquivo .npmrc na raiz do projeto
- [ ] 1.5. Criar workflow do Github Actions (.github/workflows/publish.yml)
- [ ] 1.6. Commitar todas as alterações

### Fase 2: Deploy

- [ ] 2.1. Push para repositório remoto no Github
- [ ] 2.2. Verificar execução do workflow na aba Actions
- [ ] 2.3. Verificar publicação do pacote NPM na aba Packages
- [ ] 2.4. Verificar publicação da imagem Docker na aba Packages

### Fase 3: Testes

- [ ] 3.1. Ler README.md do MCP Server
- [ ] 3.2. Ler configuração atual dos servidores MCP no AI Cockpit
- [ ] 3.3. Testar pacote NPM
  - [ ] 3.3.1. Configurar MCP Server com pacote NPM
  - [ ] 3.3.2. Executar testes de funcionalidade
  - [ ] 3.3.3. Remover configuração
- [ ] 3.4. Testar imagem Docker
  - [ ] 3.4.1. Configurar MCP Server com imagem Docker
  - [ ] 3.4.2. Executar testes de funcionalidade
  - [ ] 3.4.3. Remover configuração

---

## 📁 Estrutura de Arquivos a Criar/Modificar

```
4devs-mcp-server/
├── .github/
│   └── workflows/
│       └── publish.yml          # ⭐ NOVO - Workflow para publish
├── .npmrc                        # ⭐ NOVO - Configuração NPM
├── package.json                  # 🔄 MODIFICAR - Adicionar campos de deploy
├── Dockerfile                    # ✅ JÁ EXISTE
├── README.md                     # ✅ JÁ EXISTE
└── ... (outros arquivos)
```

---

## 🔧 Detalhamento das Modificações

### 1. Criar Repositório Remoto no Github

**Ferramenta:** Github MCP Server - `create_repository`

**Parâmetros:**
```json
{
  "name": "4devs-mcp-server",
  "description": "MCP Server for 4Devs Brazilian document generation API - Generate valid CPF, RG, CNH, PIS, birth certificates, and voter registration numbers",
  "private": false,
  "autoInit": false
}
```

**Comando Git Local:**
```bash
cd 4devs-mcp-server
git remote add origin https://github.com/edum-compassuol/4devs-mcp-server.git
```

---

### 2. Atualizar package.json

**Campos a Adicionar/Modificar:**

```json
{
  "name": "@edum-compassuol/4devs-mcp-server",
  "version": "1.0.0",
  "description": "MCP Server for 4Devs Brazilian document generation API - Generate valid CPF, RG, CNH, PIS, birth certificates, and voter registration numbers",
  "private": false,
  "author": {
    "name": "Eduardo Sausen Mallmann",
    "email": "eduardo.sausen@compasso.com.br",
    "url": "https://github.com/edum-compassuol"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com/"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/edum-compassuol/4devs-mcp-server.git"
  },
  "bugs": {
    "url": "https://github.com/edum-compassuol/4devs-mcp-server/issues"
  },
  "scripts": {
    "build": "tsc && node -e \"require('fs').chmodSync('build/index.js', '755')\"",
    "prepare": "npm run build",
    "inspector": "npx @modelcontextprotocol/inspector build/index.js"
  }
}
```

---

### 3. Criar arquivo .npmrc

**Localização:** Raiz do projeto (4devs-mcp-server/.npmrc)

**Conteúdo:**
```
@edum-compassuol:registry=https://npm.pkg.github.com
```

---

### 4. Criar Github Actions Workflow

**Localização:** `.github/workflows/publish.yml`

**Conteúdo:**
```yaml
name: Publish Package

on:
  push:
    branches:
      - main
  release:
    types: [created]

jobs:
  publish-npm:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@edum-compassuol'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Publish to GitHub Packages
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  publish-docker:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      
      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/edum-compassuol/4devs-mcp-server
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=raw,value=latest,enable={{is_default_branch}}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

---

## 🚀 Sequência de Execução

### Passo 1: Criar Repositório Remoto

```bash
# Usar Github MCP Server para criar repositório
# Tool: create_repository
```

### Passo 2: Adicionar Remote

```bash
cd 4devs-mcp-server
git remote add origin https://github.com/edum-compassuol/4devs-mcp-server.git
```

### Passo 3: Atualizar Arquivos

1. Modificar `package.json` com os campos especificados
2. Criar `.npmrc` com o conteúdo especificado
3. Criar `.github/workflows/publish.yml` com o workflow

### Passo 4: Commit e Push

```bash
git add .
git commit -m "chore: setup deployment configuration for Github Packages"
git push -u origin main
```

### Passo 5: Verificar Deploy

1. Acessar https://github.com/edum-compassuol/4devs-mcp-server/actions
2. Verificar execução do workflow "Publish Package"
3. Acessar https://github.com/edum-compassuol/4devs-mcp-server/packages
4. Verificar publicação de:
   - Pacote NPM: `@edum-compassuol/4devs-mcp-server`
   - Imagem Docker: `ghcr.io/edum-compassuol/4devs-mcp-server`

---

## 🧪 Roteiro de Testes

### Teste 1: Pacote NPM

**Configuração no AI Cockpit (settings.json):**
```json
{
  "mcpServers": {
    "4devs": {
      "command": "npx",
      "args": [
        "-y",
        "@edum-compassuol/4devs-mcp-server"
      ],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

**Testes a Realizar:**
1. Gerar 1 pessoa aleatória
2. Carregar cidades de um estado (ex: SC)
3. Gerar certidão de nascimento
4. Gerar CNH
5. Gerar PIS
6. Gerar título de eleitor

### Teste 2: Imagem Docker

**Configuração no AI Cockpit (settings.json):**
```json
{
  "mcpServers": {
    "4devs": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "ghcr.io/edum-compassuol/4devs-mcp-server:latest"
      ],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

**Testes a Realizar:**
1. Gerar 1 pessoa aleatória
2. Carregar cidades de um estado (ex: SC)
3. Gerar certidão de nascimento
4. Gerar CNH
5. Gerar PIS
6. Gerar título de eleitor

---

## 📊 Critérios de Sucesso

### Deploy
- ✅ Repositório criado no Github
- ✅ Workflow executado sem erros
- ✅ Pacote NPM publicado e visível em Packages
- ✅ Imagem Docker publicada e visível em Packages

### Testes
- ✅ Pacote NPM instalável via npx
- ✅ Todas as 6 ferramentas funcionando via NPM
- ✅ Imagem Docker executável
- ✅ Todas as 6 ferramentas funcionando via Docker

---

## 🔍 Troubleshooting

### Problema: Workflow falha na publicação NPM
**Solução:** Verificar se o GITHUB_TOKEN tem permissões de packages:write

### Problema: Workflow falha na publicação Docker
**Solução:** Verificar se o GITHUB_TOKEN tem permissões de packages:write

### Problema: Pacote NPM não encontrado
**Solução:** 
1. Verificar se o pacote foi publicado em Packages
2. Verificar se o .npmrc está configurado corretamente
3. Autenticar com: `npm login --registry=https://npm.pkg.github.com`

### Problema: Imagem Docker não encontrada
**Solução:**
1. Verificar se a imagem foi publicada em Packages
2. Autenticar com: `docker login ghcr.io -u edum-compassuol`
3. Pull manual: `docker pull ghcr.io/edum-compassuol/4devs-mcp-server:latest`

---

## 📚 Referências

- [Publishing packages with GitHub Actions](https://docs.github.com/pt/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions)
- [Publishing Docker images to GitHub Packages](https://docs.github.com/pt/actions/tutorials/publish-packages/publish-docker-images)
- [Working with the npm registry](https://docs.github.com/pt/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Working with the Container registry](https://docs.github.com/pt/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

## ✅ Próximos Passos

Após a conclusão deste plano:
1. Documentar o processo de deploy no README.md
2. Criar tags de versão para releases
3. Configurar branch protection rules
4. Adicionar badges de status no README.md
5. Criar CHANGELOG.md para tracking de versões