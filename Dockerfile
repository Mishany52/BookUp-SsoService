FROM node:lts-alpine3.19 AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
# COPY . .
COPY ./src ./src
COPY ./test ./test
COPY nest-cli.json tsconfig.build.json tsconfig.json ./
RUN yarn run build &&\
  yarn install --production --ignore-scripts --prefer-offline --frozen-lockfile

FROM node:lts-alpine3.19 AS runner
RUN apk add --no-cache tini
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "node", "dist/main" ]

