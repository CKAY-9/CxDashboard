FROM node:19-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
COPY ./public .

RUN npm install
COPY . . 
RUN npm run build
EXPOSE 3000


CMD ["npm", "run", "start"]