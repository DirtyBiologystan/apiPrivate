FROM node:16-bullseye

WORKDIR /application

RUN npm i -g npm

RUN chown node:node /application

USER node

COPY --chown=node:node package-lock.json /application/
COPY --chown=node:node package.json /application/

RUN npm i --production

COPY --chown=node:node ./src/ /application/src/


CMD ["npm","run","start"]
