FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY crawler/package*.json ./crawler/
COPY indexer/package*.json ./indexer/
COPY searcher/package*.json ./searcher/

RUN npm install

COPY . .

RUN npm run build -w crawler

CMD ["node", "--max-old-space-size=384", "crawler/dist/index.js"]