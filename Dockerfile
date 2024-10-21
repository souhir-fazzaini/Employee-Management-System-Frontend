FROM node:20

WORKDIR /src

COPY package*.json ./

RUN npm install
EXPOSE 3000
COPY . .

CMD ["npm", "start"]

