FROM node:20-slim

# Set workdir
WORKDIR /app

# Install all dependencies (include dev deps like dotenv)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Install Chromium for whatsapp-web.js / Puppeteer
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium=124.0.6367.60-1~deb12u1 \
  && rm -rf /var/lib/apt/lists/*

# whatsapp-web.js uses puppeteer under the hood; point to system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expose Express port (optional, for health check / web endpoint)
EXPOSE 3000

# Start the WhatsApp bot
CMD ["node", "whatsapp-order-bot/index.js"]
