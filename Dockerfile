FROM node:18-alpine

WORKDIR /front/

COPY public/ /front/public
COPY src/ /front/src
COPY package.json /front/
COPY tsconfig.json /front/

RUN npm install
RUN npm run build
CMD ["npm", "start"]
