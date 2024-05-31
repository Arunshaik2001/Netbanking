const { netbankConfig } = require("../env");


module.exports = {
  apps: [
    {
      name: "netbankMainBackend",
      script: "sh -c 'npm run dev:prisma  && cd ./apps/netbankMainBackend && npm run build && node ./dist/index.js'",
      env: {
        NODE_ENV: "development",
        ...netbankConfig
      },
      env_production: {
        NODE_ENV: "production",
        ...netbankConfig
      }
    },
    {
      name: "netbankOnRampTransactionsServer",
      script: "sh -c 'npm run dev:prisma  && cd ./apps/netbankOnRampTransactionsServer && npm run build  && node ./dist/index.js'",
      env: {
        NODE_ENV: "development",
        ...netbankConfig
      },
      env_production: {
        NODE_ENV: "production",
        ...netbankConfig
      }
    },
    {
      name: "netbankTransactionsServer",
      script: "sh -c 'npm run dev:prisma  && cd ./apps/netbankTransactionsServer && npm run build  && node ./dist/index.js'",
      env: {
        NODE_ENV: "development",
        ...netbankConfig
      },
      env_production: {
        NODE_ENV: "production",
        ...netbankConfig
      }
    }
  ],
};
