# Development Dockerfile for Vite / React
FROM node:20-alpine

RUN apk add --no-cache bash jq docker-cli

WORKDIR /usr/src/app

# Copy dependencies
COPY package*.json ./

RUN npm install

# Copy project files
COPY . .

EXPOSE 5173

# Start the Vite dev server
CMD ["npm", "run", "dev"]