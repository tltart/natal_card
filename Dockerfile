FROM node:18.17.0-alpine

ENV NODE_PATH="/usr/src/app/node_modules"
ENV PATH="$NODE_PATH/.bin:$PATH"

WORKDIR $NODE_PATH/..

ADD package*.json ./

RUN apk update && apk add --virtual build-deps make libc-dev gcc g++ python3 && \
    npm install && \
    apk del build-deps && \
    rm -rf $(eval echo ~$USER)/.cache && rm -rf $(eval echo ~$USER)/.npm


COPY . .

CMD ["npm", "run", "start"]
