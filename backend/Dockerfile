FROM node:18-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run generate
CMD npm start
EXPOSE 3001
