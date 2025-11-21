vfb# Multi-stage Dockerfile for GSC (Genius Software Core)

# ====================================
# Build Stage
# ====================================
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ====================================
# Production Stage
# ====================================
FROM node:20-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    curl \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S gsc -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy built application from build stage
COPY --from=build --chown=gsc:nodejs /app/dist ./dist
COPY --from=build --chown=gsc:nodejs /app/shared ./shared
COPY --from=build --chown=gsc:nodejs /app/migrations ./migrations

# Create necessary directories
RUN mkdir -p logs uploads && \
    chown -R gsc:nodejs logs uploads

# Switch to non-root user
USER gsc

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]