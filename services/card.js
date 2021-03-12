const dbManager = require('../helpers/dbmanager')

function getCard (id) {
  return dbManager.getCardById(parseInt(id))
}

function getAllCards () {
  return dbManager.getAllCards()
}

module.exports = {
  getAllCards,
  getCard
}