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
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_staging: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
  deploy: {
    staging: {
      user: 'csierra',
      host: '64.227.61.21',
      ref: 'origin/stage',
      repo: 'git@github.com/api-trace-trip.git',
      path: '/var/www/api-trace-trip',
      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=no'],
      'pre-setup': 'rimraf node_modules && rimraf dist',
      'post-setup': 'npm install --unsafe-perm && nest build',
      'post-deploy': 'pm2 reload ecosystem.config.js --env staging',
    },
  },
};
