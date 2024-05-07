FROM alpine:latest as pocketbase
ARG PB_VERSION=0.22.7
RUN apk add --no-cache unzip ca-certificates
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

FROM node:20.10 as build
WORKDIR /src
COPY package-lock.json package.json ./
RUN npm ci
COPY . .
RUN node_modules/.bin/tsc --project tsconfig.json

FROM node:20.10
WORKDIR /src
COPY package-lock.json package.json ./
RUN npm ci --omit=dev
COPY --from=pocketbase /pb /pb
COPY --from=build /src/dist /src/dist
COPY --from=build /src/embeds /src/embeds
COPY .docker/docker-entrypoint.sh /
RUN chmod 755 /docker-entrypoint.sh /pb/pocketbase
EXPOSE 8080
ENTRYPOINT [ "/docker-entrypoint.sh" ]
CMD [ "start" ]
