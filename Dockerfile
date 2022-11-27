FROM node:12-alpine
WORKDIR /app
COPY . .
RUN npm install --production
CMD ["node", "backend/index.ts"]
EXPOSE 3001