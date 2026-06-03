# Base image
FROM node:20-alpine AS deps
WORKDIR /app

# Cài deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Giảm RAM trong build
ENV NODE_OPTIONS="--max_old_space_size=2048"

# Tắt eslint khi build để nhẹ hơn
ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn build

# Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "start"]
