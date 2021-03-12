const Card = require('../models/card')
const Deck = require('../models/deck')
const User = require('../models/user')

function getUser (id) {
  return new Promise((resolve) => {
    User.findOne({id: id})
      .exec((err, user) => {
        if (err) throw err
        else resolve(user)
      })
  })
}

function updateUser (id, update) {
  return new Promise((resolve) => {
    const options = {upsert: true, new: true, setDefaultsOnInsert: true}
    User.findOneAndUpdate({id: id}, update, options)
      .exec((err, user) => {
        if (err) throw err
        else resolve(user)
      })
  })
}

function getAllDecks (query) {
  return new Promise((resolve) => {
    Deck.find(query || {})
      .populate(['cards'])
      .exec((err, decks) => {
        if (err) throw err
        else resolve(decks)
      })
  })
}

function getAllCards () {
  return new Promise((resolve) => {
    Card.find({})
      .exec((err, cards) => {
        if (err) throw err
        else resolve(cards)
      })
  })
}

function getCardById (id) {
  return new Promise((resolve) => {
    Card.findOne({id: id})
      .exec((err, card) => {
        if (err) throw err
        else resolve(card)
      })
  })
}

function addDeck (deck) {
  return new Promise((resolve, reject) => {
    getDeck({
      userId: deck.userId,
      cards: deck.cards
    })
      .then((dbDeckObject) => {
        if (dbDeckObject) resolve({deck: dbDeckObject, new: false})
        else {
          const deckObject = new Deck(deck)
          return deckObject.save()
            .then((savedDeck) => {
              resolve({deck: savedDeck, new: true})
            })
            .catch(reject)
        }
      })
  })
}

function updateDeck (deck) {
  return new Promise((resolve) => {
    Deck.update(
      {
        _id: deck._id,
      },
      {
        $set: {
          fileId: deck.fileId,
          name: deck.name,
          image: deck.image
        }
      }
    ).exec((err, raw) => {
      if (err) throw err
      else resolve(deck)
    })
  })
}

function getDeck (query) {
  return new Promise((resolve) => {
    Deck.findOne(query).populate(['cards'])
      .exec((err, decks) => {
        if (err) throw err
        else resolve(decks)
      })
  })
}

function removeDeck (deckId) {
  return new Promise((resolve) => {
    Deck.findByIdAndRemove(deckId)
      .exec((err, deck) => {
        if (err) throw err
        else resolve(deck)
      })
  })
}

module.exports = {
  getCardById,
  getAllDecks,
  addDeck,
  getDeck,
  removeDeck,
  getAllCards,
  updateDeck,
  getUser,
  updateUser
}