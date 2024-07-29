# Use the official Node.js image as the base image
FROM node:14

# Create and set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port on which the app runs
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
