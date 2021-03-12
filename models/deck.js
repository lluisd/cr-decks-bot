const mongoose = require('mongoose')
const Schema = mongoose.Schema

/* Deck Schema */
const DeckSchema = Schema({
  userId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cards: [{
    type: Schema.Types.ObjectId,
    ref: 'card'
  }],
  fileId: String,
  image: String
})

module.exports = mongoose.model('deck', DeckSchema, 'decks')