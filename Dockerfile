# Этап сборки
FROM node:22 AS build

WORKDIR /app

# Копирование файлов зависимостей и установка зависимостей
COPY package*.json ./
RUN npm install -g npm@10.8.2
RUN npm install --legacy-peer-deps

# Копирование файлов проекта и сборка
COPY . .
RUN npm run build:no

# Этап сервировки
FROM node:22

WORKDIR /app

# Копирование сборки из предыдущего этапа
COPY --from=build /app ./

# Установка зависимостей только для продакшена
RUN npm install --production --legacy-peer-deps

# Убедитесь, что команда `start` существует в вашем `package.json`
EXPOSE 3000

CMD ["npm", "start"]
