# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json & lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build Next.js app
RUN npm run build

# Expose port (Next.js uses 3000)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
