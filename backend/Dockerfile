# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose backend port
EXPOSE 3000

# Start backend using ts-node (no build step needed)
CMD ["npx", "ts-node", "src/server.ts"]
