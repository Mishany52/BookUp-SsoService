FROM node:latest


WORKDIR /app


COPY package.json yarn.lock ./


RUN yarn install


COPY . .


RUN yarn run build


RUN yarn run migration_run


CMD ["yarn", "run","start:prod"]


expose 80