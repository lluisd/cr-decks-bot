const i18n = require('i18n')
const languageService = require('../services/language')

function getLang (msg) {
  return languageService.getLanguage(msg)
    .then((lang) => {
      const t = {}

      i18n.configure({
        locales: ['en', 'es'],
        register: t,
        directory: `./locales`,
        objectNotation: true
      })

      t.setLocale(lang)
      return t
    })
}

module.exports = {
  getLang
}
