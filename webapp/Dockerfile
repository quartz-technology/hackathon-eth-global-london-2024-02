FROM node:20-bookworm-slim AS base

RUN corepack enable

FROM base AS build

ENV PNPM_HOME "/root/.local/share/pnpm"
ENV PATH "${PATH}:${PNPM_HOME}"

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc /app/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install -r --offline

COPY . /app

RUN pnpm run build && \
    pnpm prune --prod

FROM base

ENV PNPM_HOME "/home/node/.local/share/pnpm"
ENV PATH "${PATH}:${PNPM_HOME}"

ENV NODE_ENV "production"

WORKDIR /app

COPY --from=build --chown=node:node /app/.next /app/.next
COPY --from=build --chown=node:node /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/.npmrc /app/.npmrc
COPY --from=build --chown=node:node /app/package.json /app/package.json

EXPOSE 3000

USER node

CMD ["pnpm", "run", "start"]
