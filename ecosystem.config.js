module.exports = {
  apps: [
    {
      name: 'API Services | TrazeTrip',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/api-trace-trip/',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      interpreter: '/home/csierra/.nvm/versions/node/v12.18.1/bin/node',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_stating: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
  deploy: {
    stating: {
      user: 'crijosicar',
      host: '64.227.61.21',
      ref: 'origin/stage',
      repo: 'git@github.com/api-trace-trip.git',
      path: '/var/www/api-trace-trip',
      'post-deploy':
        'npm install --unsafe-perm && rimraf dist && nest build && pm2 reload ecosystem.config.js --env stating',
    },
  },
};
