# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port that your Express app is listening on
EXPOSE 3000

# Command to run your Express app inside the container
CMD ["pnpm", "start"]
