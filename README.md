# Workoelho

> ...

## About

- Bespoke Node web application with middleware support.
- URLPattern for matching routes.
- esbuild via tsx.
- JSX for templating.
- Prisma for dealing with the database.
- Superstruct for coercion and validation.

### Roadmap

- Session
- Client bundle

## Development

Copy environment file from example:

```sh
cp example.env .env
```

Start the application.

```sh
npm start
```

The `start` script will:

- Install dependencies.
- Copy pre-commit script into place, if it's a Git repository.
- Start application in "watch mode", if `NODE_ENV` is set to `development`.

## Legal

AGPL-3.0 © Arthur Corenzan and Workoelho collaborators.
