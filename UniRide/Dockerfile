ARG registry=docker.io

FROM ${registry}/librairy/node:20.9-alpine

WORKDIR /app

ENV production=true
ENV backUrl='https://127.0.0.1:5050'
ENV frontUrl='https://localhost:4200'
ENV googleKey='AIzaSyBMreuA5LC2BJ2f-HFPPdzuadezahYISSIu0mSS2Ga'

#Copy package.json and package-lock.json to avoid reinstalling dependencies when only code changes
COPY package*.json ./

RUN npm install --force

COPY . .

RUN chmod +x entrypoint.sh

#Which port the container will listen to
EXPOSE 4200

#Build the app Angular
RUN npm install -g @angular/cli
RUN apk add --no-cache gettext

ENTRYPOINT [ "/app/entrypoint.sh" ]
