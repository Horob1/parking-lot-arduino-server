# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the pre-built files from src/fe into the container

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

COPY src/fe /app/dist/fe

# Expose the port the app runs on
EXPOSE 3000

# Command to start the app
CMD ["npm", "run", "start"]
