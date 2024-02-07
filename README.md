# Workoelho

> ...

## About

- Bespoke Node web application with middleware support.
- URLPattern for matching routes.
- esbuild via tsx.
- JSX for templating.
- Prisma for dealing with the database.
- Superstruct for coercion and validation.

## Roadmap

- [x] Basic web server
- [x] Middlewares for logging, routing, etc.
- [x] Error handling
- [x] Database
- [x] Session
- [ ] Client bundle

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
- Start application in "watch mode", if `NODE_ENV` is set to `development`.

## Debugging

Start the server with `--inspect-brk` flag:

```shell
npm start -- --inspect-brk
```

Start the debugger on VSCode.

## Legal

AGPL-3.0 © Arthur Corenzan and Workoelho collaborators.
