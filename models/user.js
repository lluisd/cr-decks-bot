const mongoose = require('mongoose')
const Schema = mongoose.Schema

/* User Schema */
const UserSchema = new Schema({
  id: {
    type: Object,
    required: true
  },
  language: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('user', UserSchema, 'users')
