'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  fullName: {
    type: String
  },
  password: {
    type: String
  }
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {return next();}

  const hash = crypto.createHash('sha256').update(this.password).digest('hex');

  this.password = hash;
  next();
});

userSchema.methods.removePassword = function() {
  let user = this.toJSON();
  delete user.password;

  return user;
};

module.exports = mongoose.model('User', userSchema);
