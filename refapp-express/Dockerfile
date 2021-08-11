FROM node:14.17-slim

USER root

WORKDIR /app

COPY . .

RUN npm install

RUN mkdir -p /var/log/trace

RUN touch /var/log/trace/ntrace.log

CMD [ "npm", "start" ]