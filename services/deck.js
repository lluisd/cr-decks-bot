const dbManager = require('../helpers/dbmanager')
const canvas = require('../helpers/canvas')
const imageManager = require('../helpers/imageManager')
const config = require('../config')

function getLink (deck) {
  let url = config.shareLinkUrl
  const cardIds = deck.cards.map((card) => {
    return card.id
  })
  url = url + cardIds.join(';')
  return url
}

function getCost (deck) {
  let elixir = deck.cards.reduce((sum, card) => {
    return sum + card.elixirCost
  }, 0) / 8
  return elixir.toFixed(1)
}

function getCards (cardsIds) {
  return Promise.all(cardsIds.map((cardId) => {
    return dbManager.getCardById(parseInt(cardId))
  }))
}

function checkIfExists (cardsIds, msg) {
  return getCards(cardsIds)
    .then(cards => {
      return dbManager.getDeck({
        userId: msg.from.id,
        cards: cards.map(value => value['_id'])
      }).then(deck => {
        return deck !== null
      })
    })
}

function updateFileId (deck, file_id) {
  deck.fileId = file_id
  return dbManager.updateDeck(deck)
}

function updateDeckName (deck, name) {
  deck.name = name
  return dbManager.updateDeck(deck)
}

function getDeck (id) {
  return dbManager.getDeck({
    _id: id
  })
}

function addDeck (cardsIds, msg) {
  return getCards(cardsIds)
    .then(cards => {
      return dbManager.addDeck({
        userId: msg.from.id,
        name: msg.text,
        cards: cards.map(value => value['_id'])
      }).then((obj) => {
        if (obj.new) return obj.deck
        return null
      })
    })
}

function getAllDecks (msg) {
  return dbManager.getAllDecks({userId: msg.from.id})
}

function drawDeck (deck) {
  return canvas.drawCanvas(deck)
}

function saveImage (deck, image) {
  return imageManager.saveImage(image, deck.userId)
    .then((url) => {
      deck.image = url
      return dbManager.updateDeck(deck)
    })
}

function removeDeck (deckId) {
  return dbManager.removeDeck(deckId)
    .then((deck) => {
      return imageManager.deleteImage(deck.image)
    })
}

function imageExists (image) {
  return imageManager.exists(image)
    .then(() => {
      return true
    }).catch(() => {
      return false
    })
}

module.exports = {
  getCost,
  getLink,
  addDeck,
  checkIfExists,
  getAllDecks,
  drawDeck,
  removeDeck,
  updateFileId,
  saveImage,
  imageExists,
  getDeck,
  updateDeckName
}
