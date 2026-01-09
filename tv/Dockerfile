# Development Dockerfile for Vite / React
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy dependencies
COPY package*.json ./

RUN npm install

# Copy project files
COPY . .

EXPOSE 9092

# Start the Vite dev server
CMD ["npm", "run", "https"]
