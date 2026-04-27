# Use official Node LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /src

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose internal app port (your app runs on 3000)
EXPOSE 3000

# Start app (NO supervisor)
CMD ["node", "index.js"]