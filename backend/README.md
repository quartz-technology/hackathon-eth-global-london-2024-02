# Budal API

The Budal API abstracts the logic of budget allocation using the [Circle API](https://developers.circle.com/).

## Quickstart

### Requirements

-  [Bun](https://bun.sh/): We use Bun runtime to run the code.

### Install dependencies

```bash
bun install
```

### Configure the environment

Budal requires a valid [Circle API Key](https://developers.circle.com/w3s/docs/circle-developer-account) to run.

Please, copy the [`.env.example`](./.env.example) and replace the API key with yours.

### Generate the Prisma client

We use SQLite and Prisma to store persistent data, please generate the client before running Budal.

```shell
bunx prisma generate
```

### Run the backend

Start the backend:

```shell
bun run index.ts
```

## Testing

All the code is tested using the Bun testing framework:

```shell
bun test
```

EDIT: It's not possible to run tests anymore because we need to verify the challenge ID on each operation.

> 💡 That would be nice to have an option to force the verification for testing purpose!

## Documentation

The code is fully documented, explore the code to see it :)

Made with ❤️ by [Quartz](https://www.quartz.technology/)