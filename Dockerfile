FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including ts-node globally
RUN npm install -g ts-node typescript
RUN npm install

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy source code
COPY . .

EXPOSE 5000

# Use ts-node to run TypeScript directly
CMD ["ts-node", "./src/index.ts"]