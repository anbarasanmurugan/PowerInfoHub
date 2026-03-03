# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source including prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript code (make sure you have a build script in package.json or run tsc)
RUN npm run build || npx tsc

# Expose port
EXPOSE 5000

# Start command
CMD ["node", "dist/index.js"]
