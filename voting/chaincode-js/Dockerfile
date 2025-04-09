# Use the official Hyperledger Fabric Node.js environment image
FROM hyperledger/fabric-nodeenv:2.5

# Set the working directory inside the container
WORKDIR /chaincode

# Copy package.json and package-lock.json from one step back
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire chaincode source directory (lib/) into the container
COPY lib/ ./lib/

# Expose port if required (usually not needed for chaincode)
EXPOSE 3000

# Command to start the chaincode
CMD ["node", "lib/index.js"]
