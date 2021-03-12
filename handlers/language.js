const commands = require('../constants/commands')
const store = require('../store')
const LanguageService = require('../services/language')
const keyboard = require('../helpers/keyboard')
const initLocale = require('../helpers/initLocale')

class Language {
  selectLanguage (msg, bot, t) {
    store.update(msg.from.id, {
      command: commands.NONE
    })

    const options = keyboard.getLanguageMenu(t)
    return bot.sendMessage(msg.from.id, t.__('selectLanguage'), options)
  }

  setLanguage (msg, bot, t) {
    const lang = msg.data.split('~')[1]

    store.update(msg.from.id, {
      command: commands.NONE,
      data: {
        lang: lang
      }
    })

    LanguageService.setLanguage(msg, lang)
      .then(() => {
        initLocale.getLang(msg)
          .then((t) => {
            const options = keyboard.getMainMenu(t)
            bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            return bot.sendMessage(msg.from.id, t.__('languageChanged'), options)
          })
      })
  }
}

module.exports = Language
