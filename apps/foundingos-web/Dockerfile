FROM node:20-bookworm-slim AS build
WORKDIR /app
ARG NEXT_PUBLIC_APP_MODE=production
ARG NEXT_PUBLIC_FOUNDINGOS_API_URL
ENV NEXT_PUBLIC_APP_MODE=$NEXT_PUBLIC_APP_MODE
ENV NEXT_PUBLIC_FOUNDINGOS_API_URL=$NEXT_PUBLIC_FOUNDINGOS_API_URL
COPY . .
RUN npm ci \
  && npm run build --workspace @founder-os/auth \
  && npm run build --workspace @foundingos/foundingos-website

FROM nginx:1.27-alpine
COPY apps/foundingos-web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/foundingos-web/out /usr/share/nginx/html
EXPOSE 80
