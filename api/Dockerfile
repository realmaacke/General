FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9091
ENV NODE_ENV=production

CMD ["npm", "run", "start"]
