FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY views ./views
COPY index.js .
EXPOSE 3000
CMD ["node", "index.js"]