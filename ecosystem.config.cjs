module.exports = {
  apps: [
    {
      name: "arabia-api",
      cwd: "/home/negt/arabia_website/backend",
      script: "npm",
      args: "run start:dev",
      interpreter: "/root/.nvm/versions/node/v24.13.0/bin/node",
      env: {
        PATH: "/root/.nvm/versions/node/v24.13.0/bin:/usr/bin:/bin",
        NODE_ENV: "development",
      },
    },
    {
      name: "arabia-website",
      cwd: "/home/negt/arabia_website/website",
      script: "npm",
      args: "run dev",
      interpreter: "/root/.nvm/versions/node/v24.13.0/bin/node",
      env: {
        PATH: "/root/.nvm/versions/node/v24.13.0/bin:/usr/bin:/bin",
        NODE_ENV: "development",
      },
    },
    {
      name: "arabia-cms",
      cwd: "/home/negt/arabia_website/dashboard",
      script: "npm",
      args: "run dev",
      interpreter: "/root/.nvm/versions/node/v24.13.0/bin/node",
      env: {
        PATH: "/root/.nvm/versions/node/v24.13.0/bin:/usr/bin:/bin",
        NODE_ENV: "development",
      },
    },
  ],
};
