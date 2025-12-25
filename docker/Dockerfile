# Base image with Node + minimal dependencies
FROM node:20-slim

# Install Ollama inside container (Fly allows this)
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://ollama.com/install.sh | sh

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Build Next.js app
RUN npm run build

# Expose Next.js port
EXPOSE 3000
# Expose Ollama port
EXPOSE 11434

# Start both Next.js and Ollama
CMD ollama serve & npm start
