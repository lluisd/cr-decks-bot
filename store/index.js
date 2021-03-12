const _ = require('lodash')

let store = {
  _users: {},

  _initializeUser: function(hash) {
    return this._users[hash] = {
      command: '',
      lang: null,
      decks: new Map(),
      cards: [],
      chat: null,
      msg: null,
      rarities: [], //filter
      data: {
        cardsIds: []
      },
      deckId: null
    }
  },

  update: function(hash, data) {
    if (!this._users[hash]) this._initializeUser(hash)

    this._users[hash] = _.extend(this._users[hash], data)
  },

  getState: function(hash) {
    if (!this._users[hash]) return this._initializeUser(hash)

    return this._users[hash]
  },

  clearState: function(hash) {
    this._users[hash] = this._initializeUser()
  }
}

module.exports = store