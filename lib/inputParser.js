const commands = require('../constants/commands')

class InputParser {
  isAskingForShowDecksList (text, t) {
    return text === t.__('mainMenuOptions.show_decks') || text === '/start'
  }

  isAskingForCreateDeckFromUrl (text) {
    const pattern = /\\?deck=([0-9]{8});([0-9]{8});([0-9]{8});([0-9]{8});([0-9]{8});([0-9]{8});([0-9]{8});([0-9]{8})/gm
    return text.match(pattern)
  }

  isAskingForAddDeckName (text, prevCommand) {
    return prevCommand === commands.ADD_NEW_DECK
  }

  isAskingForEditDeckName (text, prevCommand) {
    return prevCommand === commands.RENAME_DECK
  }

  isAskingForShowLanguages (text, t) {
    return text === t.__('mainMenuOptions.change_language')
  }

  isAskingForCreateDeckFromCardsPicker (text, t) {
    return text === t.__('mainMenuOptions.new_deck')
  }

  isAskingForShowDeck (text, t) {
    const pattern = /\/d([0-9]+)$/gm
    return text.match(pattern)
  }
}

module.exports = InputParser