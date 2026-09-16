# ============================================================
# Etapa 1 — Build da aplicação React com Node.js
# ============================================================
FROM node:20-alpine AS build

WORKDIR /app

# Instala as dependências primeiro (melhor uso do cache de camadas).
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante do projeto e gera o bundle de produção.
COPY . .

# A URL da API é aplicada em tempo de build (o Vite embute no bundle).
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ============================================================
# Etapa 2 — Servidor de produção com Nginx
# ============================================================
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
