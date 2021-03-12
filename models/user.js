const mongoose = require('mongoose')
const Schema = mongoose.Schema

/* User Schema */
const UserSchema = Schema({
  id: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('user', UserSchema, 'users')