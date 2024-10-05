FROM node:18.17.0-alpine

ENV NODE_PATH="/usr/src/app/node_modules"
ENV PATH="$NODE_PATH/.bin:$PATH"

WORKDIR $NODE_PATH/..

ADD package*.json ./

RUN apk update && apk add --no-cache --virtual build-deps make libc-dev gcc g++ cairo-dev pango-dev jpeg-dev giflib-dev python3 && \
    npm install && \
    apk del build-deps && \
    rm -rf $(eval echo ~$USER)/.cache && rm -rf $(eval echo ~$USER)/.npm

RUN apk add cairo pango jpeg giflib

COPY . .

CMD ["npm", "run", "start"]
