FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev
RUN npm install -g nodemon

COPY . .

EXPOSE 9091
ENV NODE_ENV=production

CMD ["npm", "start"]
