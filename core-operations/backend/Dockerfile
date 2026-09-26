FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY . .
RUN npm ci \
  && npm run build --workspace @foundingos/service-auth \
  && npm run build --workspace @foundingos/core-operations-backend

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/shared/auth/dist ./shared/auth/dist
COPY --from=build /app/shared/auth/package.json ./shared/auth/package.json
COPY --from=build /app/core-operations/backend/dist ./core-operations/backend/dist
COPY --from=build /app/core-operations/backend/prisma ./core-operations/backend/prisma
COPY --from=build /app/core-operations/backend/package.json ./core-operations/backend/package.json
EXPOSE 4001
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy --schema core-operations/backend/prisma/schema.prisma && node core-operations/backend/dist/server.js"]
