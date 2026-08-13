FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Simple dev-server setup: fine for this assessment, avoids an nginx build stage
CMD ["npm", "run", "dev"]
