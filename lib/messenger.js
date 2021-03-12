const TelegramBot = require('node-telegram-bot-api')
const config = require('../config')
const handlers = require('../handlers')
const store = require('../store')
const Promise = require('bluebird')
const InputParser = require('./inputParser')
const inputParser = new InputParser()
const keyboard = require('../helpers/keyboard')
const initLocale = require('../helpers/initLocale')

class Messenger {
  constructor () {
    if (config.should_use_webhooks) {
      this.bot = new TelegramBot(config.telegram_api_key, {webHook: {port: config.port, host: config.host}})
      this.bot.setWebHook(config.externalUrl + ':443/bot' + config.telegram_api_key)
    } else {
      this.bot = new TelegramBot(config.telegram_api_key, {polling: true})
    }
  }

  listen () {
    this.bot.on('text', this.handleText.bind(this))
    this.bot.on('callback_query', this.handleCallbackQuery.bind(this))
    this.bot.on('inline_query', this.handleInlineQuery.bind(this))

    return Promise.resolve()
  }

  handleText (msg) {
    initLocale.getLang(msg)
      .then((t) => {
        const text = msg.text
        const options = keyboard.getMainMenu(t)

        if (inputParser.isAskingForShowLanguages(text, t))
          return handlers.language.selectLanguage(msg, this.bot, t)

        if (inputParser.isAskingForCreateDeckFromCardsPicker(text, t))
          return handlers.deck.showCards(msg, this.bot, t)

        if (inputParser.isAskingForCreateDeckFromUrl(text, t))
          return handlers.deck.getNewDeckName(msg, this.bot, t, false)

        if (inputParser.isAskingForAddDeckName(text, store.getState(msg.from.id).command))
          return handlers.deck.saveNewDeck(msg, this.bot, options, t)

        if (inputParser.isAskingForEditDeckName(text, store.getState(msg.from.id).command))
          return handlers.deck.saveDeckName(msg, this.bot, options, t)

        if (inputParser.isAskingForShowDecksList(text, t))
          return handlers.deck.getAllDecks(msg, this.bot, options, t)

        if (inputParser.isAskingForShowDeck(text, t))
          return handlers.deck.showDeck(msg, this.bot, t)

        this.bot.sendMessage(msg.from.id, '???', options)
      })
  }

  handleCallbackQuery (msg) {
    initLocale.getLang(msg)
      .then((t) => {
        const inlineQuery = msg.data.split('~')[0]
        /** edit **/
        if (inlineQuery === 'editMenu') {
          return handlers.deck.askToEditDeck(msg, this.bot, t)
        }

        if (inlineQuery === 'editName') {
          return handlers.deck.requestDeckRename(msg, this.bot, t)
        }

        if (inlineQuery === 'editCards') {

        }

        if (inlineQuery === 'backMenu') {
            return handlers.deck.showDeck(msg, this.bot, t, true)
        }

        /** Remove a deck **/
        if (inlineQuery === 'askToRemoveDeck') {
          return handlers.deck.askToRemoveDeck(msg, this.bot, t)
        }

        if (inlineQuery === 'removeDeck') {
          return handlers.deck.removeDeck(msg, this.bot, t)
        }

        if (inlineQuery === 'cancelRemoveDeck') {
          return handlers.deck.cancelRemoveDeck(msg, this.bot)
        }

        /** Language selection **/
        if (inlineQuery === 'changeLanguage') {
          return handlers.language.setLanguage(msg, this.bot, t)
        }

        /** Pagination **/
        if (inlineQuery === 'selectCardPage') {
          return handlers.deck.showCards(msg, this.bot, t, true, msg.data.split('~')[1])
        }

        /** Manual deck creation */
        if (inlineQuery === "cardSelected") {
          return handlers.deck.addNewCard(msg, this.bot, t)
        }

        if(inlineQuery === "createDeck") {
          return handlers.deck.addNewDeck(msg, this.bot, t)
        }
        if(inlineQuery === "cancelDeck") {
          return handlers.deck.cancelNewDeck(msg, this.bot, t)
        }
        if(inlineQuery === "filterDeck") {
          return handlers.deck.showCards(msg, this.bot, t, true, 1, msg.data.split('~')[1])
        }
      })
  }

  handleInlineQuery (msg) {
    initLocale.getLang(msg)
      .then((t) => {
        return handlers.deck.showDecks(msg, this.bot, t)
      })
  }
}


module.exports = Messenger