"use strict";

var bcrypt = require('bcrypt');
var shortid = require('shortid');
var _ = require('lodash');

var db = require('./').db;

class User {
  constructor(data) {
    this.id = shortid.generate();
    _.extend(this, data);
    if (this.password)
      throw new Error('Please remove the `.password` property and use `.savePassword(password)` (to save the hash) instead');
  }
  save(cb) {
    db.hmset('user:' + this.id, this, err => {
      if (err) cb(err);
      else cb(null, this);
    });
  }
  savePassword(password, cb) {
    bcrypt.hash(password, 8, (err, hash) => {
      if (err) cb(err);
      else this.save(cb);
    });
  }
  verifyPassword(password, cb) {
    bcrypt.compare(password, this.hash, cb);
  }
  static findById(id, cb) {
    db.hgetall('user:' + id, cb);
  }
  static findByUsername(username, cb) {
    cb();
    // This could get complicated with redis...
    // console.log('finding by username:', username);
    // db.keys('usera:*', (err, users) => {
    //   if (err) return cb(err);
    //   if (!users || !users.length) return cb();
    //   for (let i = 0; i < users.length; i++) {
    //     users[i]
    //   };
    //   console.log('err:', err);
    //   console.log('users:', users);
    //   // if (err) return cb(err);
    //   // if (!users) return cb();
    // });
  }
}

module.exports = User;
