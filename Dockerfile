FROM node:22.12-alpine AS builder

# Copy source code and configuration files
COPY src/ /app/src/
COPY package*.json /app/
COPY tsconfig.json /app/

WORKDIR /app

# Install all dependencies (including dev dependencies for building)
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts

# Build the TypeScript application
RUN npm run build

FROM node:22-alpine AS release

# Copy built application and package files
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

ENV NODE_ENV=production

WORKDIR /app

# Install only production dependencies
RUN npm ci --ignore-scripts --omit-dev

# Set executable permissions for the main script
RUN chmod +x build/index.js

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcp -u 1001 -G nodejs

# Change ownership of app directory to non-root user
RUN chown -R mcp:nodejs /app

# Switch to non-root user
USER mcp

# Expose stdio for MCP communication
# MCP servers typically use stdio, no network ports needed

ENTRYPOINT ["node", "build/index.js"]