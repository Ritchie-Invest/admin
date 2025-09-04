ARG NODE_VERSION=22.16.0
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
RUN apk add --no-cache git

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM base AS build
ARG VITE_API_BASE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN corepack enable && pnpm run build

FROM nginx:1.27-alpine AS runner
ENV PORT=8080

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/app.conf
COPY nginx-main.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
  && chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx

USER nginx
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:${PORT}/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
