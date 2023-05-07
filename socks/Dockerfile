FROM node:19-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install 
RUN npm run build

# Stage Two
COPY --from=0 /app/dist .
RUN npm run build
EXPOSE 3002

CMD ["npm", "run", "start"]