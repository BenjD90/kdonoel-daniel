# bullseye required for gc-stats post build
FROM node:18.20.4-bullseye AS builder

WORKDIR /home/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY ./ ./
RUN yarn run build

FROM nginx:1.27.2-alpine

WORKDIR /home/www
COPY --from=0 /home/app/dist/browser .
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

