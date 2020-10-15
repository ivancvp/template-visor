FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install pm2 -g

COPY . .

CMD ["pm2-runtime", "backend/server.js"]
