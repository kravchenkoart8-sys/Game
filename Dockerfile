FROM oven/bun:1.2-alpine
WORKDIR /app

# Copy package definition and lockfile
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install

# Copy project files
COPY . .

# Build application
RUN bun run build

# Expose server port
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["bun", "server.ts"]
