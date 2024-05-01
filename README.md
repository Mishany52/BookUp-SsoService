
## Installation

```bash
$ yarn install
```

## typeorm migrations

```bash
#создаем файлы миграций на основе *.entity.ts
$ yarn migration_auto

#создаем файлы миграций с указанием пути src/infrastructure/postgres/migrations
$ yarn migration_make

#запускаем послении миграции
$ yarn migration_run

#откат последних миграций на основе *.entity.ts
$ yarn migration_revert
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
