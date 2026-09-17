// PM2: один процесс next start. Переменные окружения Next читает сам из .env
// в корне проекта.
module.exports = {
  apps: [
    {
      name: "neon",
      cwd: "/var/www/neon",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      autorestart: true,
      max_memory_restart: "600M",
      env: { NODE_ENV: "production" }
    }
  ]
};
