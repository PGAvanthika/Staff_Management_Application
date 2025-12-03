# Frontend Dockerfile - Multi-stage build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Use npm install with legacy-peer-deps to handle peer dependency issues
RUN npm cache clean --force && \
    npm install --legacy-peer-deps

# Ensure react-scripts is installed (explicit install if needed)
RUN npm list react-scripts || npm install react-scripts@5.0.1 --legacy-peer-deps --save

# Copy application files
COPY . .

# Build the application using npx to ensure we use the local binary
# npx will automatically find react-scripts in node_modules/.bin
RUN npx --yes react-scripts build

# Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration (will be mounted via docker-compose)
# The nginx config will be provided via docker-compose volume

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

