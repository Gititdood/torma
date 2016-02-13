var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = mongoose.Schema({
  username: 'string',
  hash: 'string',
});

schema.methods.savePassword = function(password, done) {
  var user = this;
  console.log('password:', password);
  bcrypt.hash(password, 8, function(err, hash) {
    if (err) return done(err);
    user.hash = hash;
    user.save(done);
  });
};

schema.methods.verifyPassword = function(password, done) {
  var user = this;
  bcrypt.compare(password, user.hash, done);
};

var model = mongoose.model('user', schema);

module.exports = model;
