FROM node:16
WORKDIR /usr/yagami

RUN apt-get update \
    && apt-get install -qq build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev g++ graphicsmagick

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

CMD [ "yarn", "start" ]