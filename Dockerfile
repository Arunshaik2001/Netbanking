FROM node:20


# add turborepo
RUN npm install -g turbo

# Set working directory
WORKDIR /app

COPY  ["package-lock.json", "package.json", "./"] 

COPY . .

RUN npm install

EXPOSE 4000 5173

CMD ["npm", "run", "dev:docker"]