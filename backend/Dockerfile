# Use Node.js official image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files into the container
COPY . .

# Expose the application port (must match your app's port)
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]
