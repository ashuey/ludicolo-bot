FROM node:20.14 as build
WORKDIR /src
COPY package-lock.json package.json ./
RUN npm ci
COPY . .
RUN node_modules/.bin/tsc --project tsconfig.json

FROM node:20.14
WORKDIR /src
COPY package-lock.json package.json ./
RUN mkdir data && npm ci --omit=dev
COPY --from=build /src/dist /src/dist
EXPOSE 8080
ENTRYPOINT [ "node", "/src/dist/cmd/index.js" ]
CMD [ "start" ]
