FROM node:20-alpine AS base

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]