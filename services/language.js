const dbManager = require('../helpers/dbmanager')
const store = require('../store')
const config = require('../config')

function setLanguage (msg, lang) {
  updateStore(msg, lang)
  return dbManager.updateUser(msg.from.id, {language: lang}).then((user) => {
    return true;
  })
}

function getLanguage (msg) {
  return new Promise((resolve) => {
    const lang = store.getState(msg.from.id).lang
    if (!lang) {
      return dbManager.getUser(msg.from.id)
        .then(user => {
          const lang = (user || {}).language || config.defaultLanguage
          updateStore(msg, lang)
          return resolve(lang)
        })
    }
    resolve(lang)
  })
}

function updateStore (msg, lang) {
  store.update(msg.from.id, {lang: lang})
}

module.exports = {
  setLanguage,
  getLanguage
}
