FROM node:24-bookworm-slim AS build
WORKDIR /app
ARG NEXT_PUBLIC_APP_MODE=production
ARG NEXT_PUBLIC_FOUNDINGOS_API_URL
ENV NEXT_PUBLIC_APP_MODE=$NEXT_PUBLIC_APP_MODE
ENV NEXT_PUBLIC_FOUNDINGOS_API_URL=$NEXT_PUBLIC_FOUNDINGOS_API_URL
COPY . .
RUN npm ci \
  && npm run build --workspace @foundingos/service-auth \
  && npm run build --workspace @foundingos/foundingos-website

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
EXPOSE 3000
CMD ["npm", "run", "start", "--workspace", "@foundingos/foundingos-website", "--", "-p", "3000"]
