# Workoelho

> Workoelho is an open-source knowledge hub for small web development teams.

## About

Workoelho is a web application that helps answering questions like:

1. How many web applications do our organization maintain?
2. Where are these applications hosted or what domains they use?
3. What providers are used for hosting, registrar, DNS, email, etc?
4. Who are the people responsible for these applications?
5. What information a newcomer needs to get started?

## Development

It's a Next.js application. To start, install the dependencies:

```shell
npm ci
```

Create a local environment configuration file:

```shell
cp .env.example .env
```

Then launch the application:

```shell
npm start
```

If `NODE_ENV` is set to production, it'll start in production mode, otherwise it'll start in development mode.

## Legal

MPL-2.0 ©️ Arthur Corenzan and Workoelho contributors.
