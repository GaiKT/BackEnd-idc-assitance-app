# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Prisma CLI
RUN npm install prisma --save-dev
RUN npm install @prisma/client@dev prisma@dev

# Install PostgreSQL client
RUN npm install pg

# Copy the rest of the application code
COPY . .

# npx prisma generate
RUN npx prisma generate

# Expose the backend port (adjust if necessary)
EXPOSE 4000

# Start the Node.js application
CMD ["npm", "start"]