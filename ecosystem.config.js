module.exports = {
  apps: [
    {
      name: 'wa-server',
      script: 'server.js',
      cwd: './wa-server',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      env: {
        PORT: 3001,
        AUTH_SECRET: 'gatesend_secret_2024',
      },
    },
  ],
};
