FROM node:lts-alpine3.19

run yarn install

run yarn run typeorm migration:run

run yarn run build

run yarn run start:prod


expose 80