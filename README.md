# Workoelho

> Workoelho is an open-source knowledge hub designed specially for web development teams, DevOps, SRE, etc.

## About

- It’s open-source, can be self hosted and supports data exfil.
- It centralizes information without replacing your preferred tools.
- New teammates can find everything they need on their own and with proper authorization.
- Impact can be gauged in minutes, from service provider swaps to security vulnerabilities.
- You can track changes over time, across your organization, and identify patterns and trends.

It helps answering questions like:

1. What service providers my company use?
2. Who oversees what?
3. What technologies this project depends on?
4. Where can I find the credentials to this service?
5. Since when we use this service?
6. What information a newcomer needs to get started?

## Development

- Bespoke web application in TypeScript.
- Middleware support.
- URLPattern for routing.
- esbuild via tsx.
- JSX for templating.
- Prisma for dealing with the database.
- Superstruct for coercion and validation.

### Getting started

Create an environment file from the template:

```sh
cp .env.example .env
```

Start the application.

```sh
env $(cat .env | xargs) npm start
```

The `start` script will:

- Install dependencies, if needed.
- Start application in "watch mode", if `NODE_ENV` is set to `development`.

### Debugging

Start the server with `--inspect-brk` flag:

```shell
env $(cat .env | xargs) npm start -- --inspect-brk
```

Start the debugger on VSCode.

## Legal

AGPL-3.0 © Arthur Corenzan and Workoelho collaborators.
