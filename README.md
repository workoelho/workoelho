# Workoelho

> ...

## About

- Bespoke web application in TypeScript.
- Middleware support.
- URLPattern for routing.
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
- [ ] Leave serving static files to proxy
- [ ] Read method override from body
- [ ] Client bundle

## Development

Copy environment file from example:

```sh
cp example.env .env
```

Start the application.

```sh
env $(cat .env | xargs) npm start
```

The `start` script will:

- Install dependencies, if needed.
- Start application in "watch mode", if `NODE_ENV` is set to `development`.

## Debugging

Start the server with `--inspect-brk` flag:

```shell
npm start -- --inspect-brk
```

Start the debugger on VSCode.

## Legal

AGPL-3.0 © Arthur Corenzan and Workoelho collaborators.
