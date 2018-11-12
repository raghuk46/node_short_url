FROM node:latest

LABEL maintainer="Raghuram Kumar <raghuk46@gmail.com>"

USER node

ENV HOME=/home/node

RUN mkdir -p $HOME/app

RUN chown -R $USER:$USER $HOME/*

WORKDIR $HOME/app

COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile && yarn cache clean

COPY . .

# setup enviroment arguments
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN yarn run build

EXPOSE 4000

CMD ["yarn", "start"]