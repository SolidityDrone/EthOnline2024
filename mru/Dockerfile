# Use an official Node.js runtime as a parent image
FROM node:lts-bookworm-slim

# Install bun globally
RUN npm install -g bun

# Set the working directory inside the container to /app (or you can use /mru)
WORKDIR /mru

# Copy package.json and tsconfig.json into /mru inside the container
COPY package.json tsconfig.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application code to /mru inside the container
COPY . .

# Command to run the application
CMD ["bun", "start"]
