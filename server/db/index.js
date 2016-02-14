var redis = require('redis');
var client = redis.createClient();

client.on('ready', () => console.log('Redis client ready!'));
client.on('error', err => console.log('Redis client error:', err));

exports.db = client;
exports.user = require('./user');
