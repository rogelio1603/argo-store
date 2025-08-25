# ============ 1) Dependencias ============ #
FROM node:22.18.0 AS deps
WORKDIR /app

# Paquetes base útiles (ca-certificates para HTTPS, tzdata por si lo ocupas)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates tzdata \
  && rm -rf /var/lib/apt/lists/*

# Copiamos manifiestos y resolvemos deps con npm
COPY package*.json ./
RUN npm ci --include=dev

# ============ 2) Build ============ #
FROM node:22.18.0 AS builder
WORKDIR /app

# Copiamos node_modules y el resto del código
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Evita telemetría en build (opcional)
ENV NEXT_TELEMETRY_DISABLED=1
# Importante: NO metas secretos aquí; se leen en runtime por env.
RUN npm run build

# ============ 3) Runtime ============ #
FROM node:22.18.0 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Usuario no root (viene con la imagen oficial)
USER node

# Copiamos artefactos standalone mínimos para correr Next
# - server.js y node_modules necesarios están dentro de .next/standalone
COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/.next/static ./.next/static
COPY --chown=node:node --from=builder /app/public ./public

EXPOSE 3000

# Healthcheck simple (usa Node mismo; sin curl/wget)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get({host:'127.0.0.1',port:process.env.PORT||3000,path:'/'},res=>{if(res.statusCode<500)process.exit(0);process.exit(1)}).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
