FROM node:18
WORKDIR /src
COPY package-lock.json package.json ./
RUN npm ci
COPY . .
RUN node_modules/.bin/tsc
ENTRYPOINT [ "node", "dist/cmd/index.js" ]
CMD [ "start" ]
