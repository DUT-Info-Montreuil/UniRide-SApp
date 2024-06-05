FROM node:20.9-alpine

WORKDIR /app

ENV production='true'
ENV backUrl='https://127.0.0.1:5050'
ENV frontUrl='https://localhost:4200'
ENV googleKey='AIzaSyBMreuA5LC2BJ2f-HFPPdzuadezahYISSIu0mSS2Ga'

RUN apk add curl

#Copy package.json and package-lock.json to avoid reinstalling dependencies when only code changes
COPY package*.json ./

RUN npm install --force

COPY . .

RUN mkdir src/app/certs

RUN curl \
    -o src/app/certs/flask-selfsigned.crt \
    'https://pastebin.com/raw/853gU6nq'

RUN curl \
    -o src/app/certs/flask-selfsigned.key \
    'https://pastebin.com/raw/FS2Dv8hp'

RUN chmod +x entrypoint.sh

#Which port the container will listen to
EXPOSE 4200

#Build the app Angular
RUN npm install -g @angular/cli
RUN apk add --no-cache gettext

ENTRYPOINT [ "entrypoint.sh" ]
