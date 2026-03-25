FROM node:20

# Install PostgreSQL client (for pg_isready)
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY wait-for-db.sh .

EXPOSE 3000

ENTRYPOINT ["./wait-for-db.sh", "db", "node", "server.js"]
