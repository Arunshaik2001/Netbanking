FROM ubuntu:latest

RUN apt update 
RUN apt-get install -y build-essential make automake gcc g++ cpp libkrb5-dev libc6-dev man-db autoconf pkg-config 


# Install NodeJS
RUN apt-get update && apt-get install -y apt-utils && apt-get install -y nodejs && apt-get install -y npm && apt-get install -y python3
RUN npm install -g node-gyp

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# add turborepo
RUN npm install -g turbo

# Set working directory
WORKDIR /app

COPY  ["package-lock.json", "package.json", "./"] 

COPY . .

RUN npm install

RUN npm rebuild bcrypt --build-from-source

EXPOSE 4000 5173

CMD ["npm", "run", "dev:docker"]