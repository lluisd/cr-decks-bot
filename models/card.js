const mongoose = require('mongoose')
const Schema = mongoose.Schema

/* Card Schema */
const CardSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: 'Common Rare Epic Legendary Champion'.split(' '),
    require: true,
  },
  type: {
    type: String,
    enum: 'Troop Building Spell'.split(' '),
    require: true,
  },
  elixirCost: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('card', CardSchema, 'cards')
