var redis = require('redis');
var client = redis.createClient();

client.on('ready', () => {
  console.log('Redis client ready!')
  client.select(1, function(err, res) {});
});

client.on('error', err => {
  console.log('Redis client error:', err.message);
  process.exit(1);
});

exports.db = client;
exports.user = require('./user');
