FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Copy .env file explicitly
COPY .env ./

EXPOSE 5000
CMD ["npm", "start"]