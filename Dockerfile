FROM node:10
WORKDIR /app
COPY package.json ./
RUN npm install --only=prod
COPY . ./
EXPOSE 3005

CMD ["npm", "build"]
CMD ["npm", "start"]