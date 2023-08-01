FROM node:18.16.0-slim

WORKDIR /app
COPY ./scripts/package.json /app/package.json

WORKDIR /app
RUN apt-get upgrade \
&&  apt-get update \
&&  apt-get install -y \
        libappindicator1 \
        fonts-liberation \
        chromium \
&&  npm install --force

ENV NO_SANDBOX=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

CMD ["script.js"]