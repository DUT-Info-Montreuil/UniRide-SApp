#!/bin/sh

envsubst < src/environments/environment.template.ts > src/environments/environment.ts
ng serve --ssl --ssl-cert src/app/certs/flask-selfsigned.crt --ssl-key src/app/certs/flask-selfsigned.key --host 0.0.0.0 --disable-host-check
