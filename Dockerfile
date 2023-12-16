FROM node:20.10
WORKDIR /src
COPY package-lock.json package.json ./
RUN npm ci
COPY . .
RUN node_modules/.bin/tsc --project tsconfig.json

FROM node:20.10
WORKDIR /src
COPY package-lock.json package.json ./
RUN npm ci --omit=dev
COPY --from=0 /src/dist /src/dist
ENTRYPOINT [ "node", "dist/cmd/index.js" ]
CMD [ "start" ]
