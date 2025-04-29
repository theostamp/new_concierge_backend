# frontend/Dockerfile

# Base image
FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app source
COPY . .

# Expose port (Next.js runs on 3000)
EXPOSE 3000

# Default command
CMD ["npm", "run", "dev"]
