# Netbanking App

This is a fake netbanking app which supports ![Payment-Transfer Karo App](https://github.com/Arunshaik2001/Paymnt-Transfer-karo) for Onramping and Offramping money.

## High Level Design

<img src=https://github.com/Arunshaik2001/Netbanking/assets/50947867/7610ff0e-4bbf-4baf-9f2c-c057fcc28392 height=600px />

## Demo

[FakeNetbankingApp.webm](https://github.com/Arunshaik2001/Netbanking/assets/50947867/157f1734-7536-4195-a21a-ade9dc6d4ee4)


[PaymntApp.webm](https://github.com/Arunshaik2001/Paymnt-Transfer-karo/assets/50947867/915853c3-3aa0-489f-801d-8ce73030be96)



## Features
 1. Create Netbanking Id provided you have bank account number you can use pre-added bank account numbers or you can add your own in db/prisma/seed.ts.
 2. OffRamp fake money from netbanking app.
 3. OnRamp fake money.


## Tech Stack
 1. Reactjs
 3. Websocket
 4. Express Server
 5. Redis as Queues
 6. Postgres
 7. Jwt Authentication.
 8. Docker


## CI/CD jobs
 1. On pull requests build job will be run
 2. On push to main branch it will be pushed docker image.
 3. On push to main branch it will copy main branch to ec2 server and start the nodejs apps.

## Set up Locally

### Without docker

```js
// Make Sure You have env.js created on root folder where you have both netbanking and paymnt repo.

const netbankConfig = {
    DATABASE_URL: "YOUR_DATABASE_URL",
    HDFC_JWT_LOGIN_SECRET: "PAYMNT_SECRET_HDFC",
    REDIS_URL: "YOUR_REDIS_URL"
}

const paymntConfig = {
    DATABASE_URL: "YOUR_DATABASE_URL",
    HDFC_PAYMNT_BANK_SERVER_KEY: "HDFC_SECRET",
    PAYMNT_HDFC_BANK_SERVER_KEY: "PAYMNT_SECRET_HDFC",
    KOTAK_PAYMNT_BANK_SERVER_KEY: "KOTAK_SECRET",
    PAYMNT_KOTAK_BANK_SERVER_KEY: "PAYMNT_SECRET_KOTAK",
    HDFC_BANK_SERVER: "http://localhost:4000",
    PAYMNT_WEBHOOK_PORT: 3005,
    PAYMNT_WEBSOCKET_PORT: 3006
}

module.exports = {
    netbankConfig,
    paymntConfig
};

```

```
 clone the repo
 npm install
 npx pm2 start ecosystem.config.js
 npm run dev:hdfcnetbankfrontend
```

### With Docker

**Step 1:** add this in **.env** file inside /Netbanking

make sure to update with your own **database url and redis url**
```js
DATABASE_URL="postgres://YOUR_DB_URL/netbanking?sslmode=require"
REDIS_URL="YOUR_REDIS_URL"
HDFC_JWT_LOGIN_SECRET="PAYMNT_SECRET_HDFC"
VITE_HDFC_MAIN_SERVER="http://localhost:4000/"
VITE_HDFC_DEBIT_SERVER_URL="http://localhost:4000/api/v1/auth/debit"
VITE_HDFC_CREATE_SERVER_URL="http://localhost:4000/api/v1/create"
VITE_HDFC_LOGIN_SERVER_URL="http://localhost:4000/api/v1/auth/login"
VITE_HDFC_MAIN_SOCKET_SERVER="ws://localhost:4000/"
VITE_CLOUDFARE_TOKEN="ws://localhost:4000/"
```

**Step 2:** 
    Build the _Dockerfile_
 
```shell
    docker build -t netbanking .
```

**Step 3:**
    Update the image name in _**docker-compose-netbanking.yml**_

    image: netbanking:latest

**Step 4:**
  run in /Netbanking

  ```shell
    npm run docker-compose
  ```

### For dummy data
[seed.ts](https://github.com/Arunshaik2001/Netbanking/blob/main/packages/db/prisma/seed.ts))

You can run in the packages/db folder
```sh
 npx prisma db seed
