FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Create app directory and non-root user
WORKDIR /app
RUN addgroup -S chronos && adduser -S -G chronos chronos

# Copy package files and install production dependencies
COPY package.json ./
RUN npm install --production && \
    npm cache clean --force

# Copy built application from build stage
COPY --from=build /app/build ./build

# Set executable permissions
RUN chmod +x ./build/index.js && \
    chown -R chronos:chronos /app

# Set environment variables
ENV NODE_ENV=production

# Switch to non-root user
USER chronos

# Handle signals properly
ENV NODE_OPTIONS="--unhandled-rejections=strict"

# Run the application
CMD ["node", "build/index.js"]
