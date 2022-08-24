FROM node:16

WORKDIR /usr/src/app

COPY simple_product_api/package*.json ./
RUN npm install

COPY ./simple_product_api/ .

EXPOSE 3003

CMD [ "npm", "start" ]