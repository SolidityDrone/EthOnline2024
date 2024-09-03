FROM node:lts-bookworm-slim

RUN npm install -g npm@latest

# Install bun globally
RUN npm install -g bun

WORKDIR /

# Command to run the application
CMD ["bun", "start"]
