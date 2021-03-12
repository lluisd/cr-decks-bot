const commands = require('../constants/commands')
const DeckService = require('../services/deck')
const CardService = require('../services/card')
const store = require('../store')
const config = require('../config')
const keyboard = require('../helpers/keyboard')

class Deck {

  //Deck creation
  addNewDeck (msg, bot, t) {
    let cards = store.getState(msg.from.id).cards
    store.update(msg.from.id, {
      command: commands.NONE,
      cards: [],
      msg: msg.message.message_id,
      chat: msg.message.chat.id
    })
    let cardIds = cards.map(card => card.id)
    if (cardIds.length === 8) {
      this._requestDeckName(msg, bot, t, cardIds)
    }
  }

  cancelNewDeck (msg, bot, t) {
    store.update(msg.from.id, {
      command: commands.NONE,
      cards: []
    })
    bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
    bot.sendMessage(msg.from.id, t.__('createDeckOptions.canceled'))
  }

  getNewDeckName (msg, bot, t) {
    const cardIds = msg.text.split('?').pop().split('&')[0].split('=').pop().split(';')
    this._requestDeckName(msg, bot, t, cardIds)
  }

  saveNewDeck (msg, bot, options, t) {
    store.update(msg.from.id, {
      command: commands.NONE
    })

    const state = store.getState(msg.from.id)
    const cardIds = state.data.cardIds

    bot.deleteMessage(state.chat, state.msg)

    DeckService.addDeck(cardIds, msg)
      .then((deck) => {
        if (deck) {
          DeckService.getDeck({_id: deck._id})
            .then((deck) => {
              bot.sendMessage(msg.from.id, t.__('new_deck_added'), options)
              this._showDeck(msg, bot, deck, t)
            })
        } else {
          bot.sendMessage(msg.from.id, t.__('deck_already_exists'), options)
        }
      })
  }

  addNewCard (msg, bot, t) {
    const cardId =  msg.data.split('~')[1].split(':')[1]
    const page = msg.data.split('~')[1].split(':')[0]
    let selectedCards = store.getState(msg.from.id).cards
    let modified = true

    store.update(msg.from.id, {
      command: commands.NONE
    })

    CardService.getCard(cardId)
      .then((card) => {
        if (selectedCards.find(selected => selected.id === card.id))
          selectedCards = selectedCards.filter(selected => selected.id !== card.id)
        else if (selectedCards.length < 8)
          selectedCards.push(card)
        else
          modified = false

        if (modified) {
          store.update(msg.from.id, {
            cards: selectedCards
          })

          this.showCards(msg, bot, t, true, page)
        }
      })
  }

  //Show/list
  getAllDecks (msg, bot, options, t) {
    store.update(msg.from.id, {
      command: commands.NONE
    })

    let deckMap = new Map()
    DeckService.getAllDecks(msg)
      .then((decks) => {
        if (decks.length === 0) {
          return bot.sendMessage(msg.from.id, t.__('empty_decks_list'), options)
        }
        let text = t.__('your_decks') + '\n'
        decks.forEach((deck, i) => {
          const command = '/d' + (i + 1)
          deckMap.set(command, deck._id)
          text = text + command + ' ' + deck.name + ' <i>(' + DeckService.getCost(deck) + '</i>) \n'
        })

        store.update(msg.from.id, {
          decks: deckMap
        })

        options['parse_mode'] = 'html'
        bot.sendMessage(msg.from.id, text, options)
      })
  }

  showDeck (msg, bot, t, edit = false) {
    const state = store.getState(msg.from.id)
    let deckId = state.decks.get(msg.text)

    if (edit) {
      deckId = state.deckId
    }

    if (!deckId) return

    store.update(msg.from.id, {
      command: commands.NONE,
      deckId: deckId
    })

    DeckService.getDeck({_id: deckId})
      .then((deck) => {
        if (deck) {
          this._showDeck(msg, bot, deck, t, edit)
        }
      })
  }

  showCards (msg, bot, t, edit = false, page = 1, cardRarity = null) {
    const selectedCards = store.getState(msg.from.id).cards || []
    let selectedRarities = store.getState(msg.from.id).rarities || []

    store.update(msg.from.id, {
      command: commands.NONE,
    })

    CardService.getAllCards()
      .then((cards) => {
        let availableCards = cards.filter(card => !selectedCards.find(selected => selected.id === card.id))

        if(cardRarity !== null) {
          if(selectedRarities.includes(cardRarity)) {
            let index = selectedRarities.findIndex(r => r === cardRarity);
            if(index >= 0) {
              selectedRarities.splice(index, 1);
            }
          } else {
            selectedRarities = [];
            selectedRarities.push(cardRarity)
          }
          store.update(msg.from.id, {
            rarities: selectedRarities
          })
        }
        if(selectedRarities.length > 0) {
          availableCards = availableCards.filter(card => selectedRarities.includes(card.rarity));
        }

        const options = keyboard.getCardsMenu(t, availableCards, selectedCards, page, selectedRarities)
        if(edit) {
          options.chat_id = msg.from.id
          options.message_id = msg.message.message_id
          return bot.editMessageText(t.__('createDeckOptions.createDeck'), options);
        }
        return bot.sendMessage(msg.from.id, t.__('createDeckOptions.selectCards'), options)
      })
  }

  showDecks (msg, bot, t) {
    store.update(msg.from.id, {
      command: commands.NONE
    })

    const text = msg.query

    DeckService.getAllDecks(msg)
      .then((decks) => {
        const results = []

        decks.forEach((deck, i) => {
          if ((deck.name.includes(text)) && results.length < 50) {
            results.push({
              // type: 'photo',
              // id: `${getRandomInt(1000000000000000, 999999999999999999)}`,
              // title: deck.name,
              // photo_url: 'http://res.cloudinary.com/lluis/image/upload/' + deck.image + '.png',
              // 'photo_width': 48,
              // 'photo_height': 48,
              // thumb_url: 'http://res.cloudinary.com/lluis/image/upload/w_200,h_200,c_pad,b_white,bo_4px_solid_black/' + deck.image + '.png',
              // description: DeckService.getCost(deck),
              // caption: t.__('elixir_cost') + ': ' + DeckService.getCost(deck) + ' [​​​​​​​​​​​' + t.__('link_to_use') + '](' + DeckService.getLink(deck) + ')',
              // parse_mode: 'markdown',
              type: 'article',
              id: `${getRandomInt(1000000000000000, 999999999999999999)}`,
              title: deck.name,
              thumb_url: config.cloudinary.url + 'w_200,h_200,c_pad,b_white/' + deck.image + '.png',
              description: DeckService.getCost(deck),
              input_message_content: {
                message_text: this._getDeckTitle(deck, t),
                parse_mode: 'markdown'
              }
            })
          }
        })

        bot.answerInlineQuery(msg.id, results, {cache_time: 1})
      })
  }

  //Deck edition
  askToEditDeck (msg, bot, t) {
    const deckId = msg.data.split('~')[1]
    store.update(msg.from.id, {
      command: commands.NONE
    })

    const options = keyboard.getEditMenu(t, deckId)
    options.chat_id = msg.from.id
    options.message_id = msg.message.message_id

    return bot.editMessageReplyMarkup(options.reply_markup, options)
  }

  requestDeckRename (msg, bot, t) {
    const deckId = msg.data.split('~')[1]
    store.update(msg.from.id, {
      command: commands.RENAME_DECK,
      deckId: deckId
    })

    return bot.sendMessage(msg.from.id, t.__('ask_deck_rename'))
  }

  saveDeckName (msg, bot, options, t) {
    store.update(msg.from.id, {
      command: commands.NONE
    })

    const state = store.getState(msg.from.id)
    const deckId = state.deckId
    const newDeckName = msg.text;

    if (newDeckName === null || newDeckName === undefined || newDeckName.trim() === '' || !deckId) {
      return bot.sendMessage(msg.from.id, t.__('deck_rename_cancelled'), options)
    }

    DeckService.getDeck({_id: deckId})
      .then((deck) => {
        if (deck) {
          DeckService.updateDeckName(deck, msg.text)
          return bot.sendMessage(msg.from.id, t.__('deck_renamed'), options)
        }
      })
  }

  //Remove deck
  askToRemoveDeck (msg, bot, t) {
    const deckId = msg.data.split('~')[1]
    store.update(msg.from.id, {
      command: commands.NONE
    })

    const keyboardStr = JSON.stringify({
      inline_keyboard: [
        [
          {text: t.__('yes'), callback_data: 'removeDeck~' + deckId + '~' + msg.message.message_id},
          {text: t.__('no'), callback_data: 'cancelRemoveDeck~' + deckId}
        ]
      ]
    })

    bot.sendMessage(msg.from.id, t.__('ask_confirm_delete')
      , {
        parse_mode: 'markdown',
        reply_markup: JSON.parse(keyboardStr)
      })
  }

  removeDeck (msg, bot, t) {
    store.update(msg.from.id, {
      command: commands.NONE
    })

    DeckService.removeDeck(msg.data.split('~')[1])

    bot.deleteMessage(msg.message.chat.id, msg.data.split('~')[2])
    bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
    bot.sendMessage(msg.from.id, t.__('deck_deleted'))
  }

  cancelRemoveDeck (msg, bot) {
    store.update(msg.from.id, {
      command: commands.NONE
    })
    bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
  }

  _requestDeckName(msg, bot, t, cardIds) {
    DeckService.checkIfExists(cardIds, msg)
      .then(checkLimit)

    function checkLimit (resp) {
      if (resp) {
        return bot.sendMessage(msg.from.id, t.__('deck_already_exists'))
      }

      DeckService.getAllDecks(msg)
        .then(sendNameRequest)
    }

    function sendNameRequest (resp) {
      if (resp.length >= config.deckLimitPerUser) {
        return bot.sendMessage(msg.from.id, t.__('deck_limit_exceeded'))
      }
      store.update(msg.from.id, {
        command: commands.ADD_NEW_DECK,
        data: {
          cardIds: cardIds
        }
      })
      bot.sendMessage(msg.from.id, t.__('ask_deck_name'))
    }
  }

  _showDeck (msg, bot, deck, t, edit = false) {
    const keyboardStr = JSON.stringify({
      inline_keyboard: [
        [
          {text: t.__('deckOptions.use'), url: DeckService.getLink(deck)},
          {text: t.__('deckOptions.edit'), callback_data: 'editMenu~' + deck._id},
          {text: t.__('deckOptions.delete'), callback_data: 'askToRemoveDeck~' + deck._id}
        ]
      ]
    })

    if (!deck.image) {
      this._uploadNewImage(msg, bot, deck, keyboardStr, t)
    } else {
      DeckService.imageExists(deck.image).then((exists) => {
        if (exists) {
          this._sendDeck(msg, bot, deck, keyboardStr, t, edit)
        } else {
          this._uploadNewImage(msg, bot, deck, keyboardStr, t)
        }
      })
    }
  }

  _uploadNewImage (msg, bot, deck, keyboardStr, t) {
    DeckService.drawDeck(deck).then((result) => {
      DeckService.saveImage(deck, result).then((savedDeck) => {
        this._sendDeck(msg, bot, savedDeck, keyboardStr, t)
      })
    })
  }

  _sendDeck (msg, bot, deck, keyboardStr, t, edit = false) {
    const text = '' + this._getDeckTitle(deck, t);
    const options = {
      parse_mode: 'markdown',
      reply_markup: JSON.parse(keyboardStr)
    }
    if(edit) {
      options.chat_id = msg.from.id
      options.message_id = msg.message.message_id
      return bot.editMessageText(text, options);
    }
    return bot.sendMessage(msg.from.id, text, options)
  }

  _getDeckTitle(deck, t) {
    return '[​​​​​​​​​​​\u200c]('+ config.cloudinary.url + deck.image + '.png)' +
    '*' + deck.name + '* (' + DeckService.getCost(deck) + ') - ' +
    '[​​​​​​​​​​​' + t.__('link_to_use') + '](' + DeckService.getLink(deck) + ')';
  }
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min
}

module.exports = Deck