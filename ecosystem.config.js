module.exports = {
  apps: [{
    name: 'prime-asset',
    script: 'server/server.js',
    cwd: '/var/www/prime',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3030
    }
  }]
};
