FROM node:14.15.4-alpine3.12
RUN apk add --no-cache bash git
RUN npm config set cache /home/.npm-cache --global
WORKDIR /home
USER node