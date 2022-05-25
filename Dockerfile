FROM node:16.14.2-alpine

RUN mkdir -p /app
WORKDIR /app

COPY *.json /app/
COPY dist/* /app/
RUN touch /app/reactor.json

RUN npm install

CMD ["node", "--es-module-specifier-resolution=node", "index.js"]