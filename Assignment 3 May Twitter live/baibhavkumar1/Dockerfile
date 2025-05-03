# Use Node.js LTS version
FROM node:20-alpine AS deps

# Install system dependencies for Sharp and other image processing
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Builder stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for production
ENV NODE_ENV=production
ENV NEXT_PUBLIC_MAX_FILE_SIZE=5242880
ENV NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
ENV NEXT_PUBLIC_IMAGES_PER_PAGE=6
ENV NEXT_PUBLIC_RATE_LIMIT_REQUESTS=100
ENV NEXT_PUBLIC_RATE_LIMIT_WINDOW_MS=900000

# Build the application
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

# Create uploads and processed directories with correct permissions
RUN mkdir -p public/uploads public/processed && \
    chown -R node:node public

# Install production dependencies only
RUN apk add --no-cache libc6-compat

# Copy necessary files from builder
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Switch to non-root user
USER node

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "server.js"]