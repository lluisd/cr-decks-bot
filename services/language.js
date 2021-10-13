const dbManager = require('../helpers/dbmanager')
const store = require('../store')
const config = require('../config')

async function setLanguage (msg, lang) {
  updateStore(msg, lang)
  return await dbManager.updateUser(msg.from.id, { language: lang })
}

async function getLanguage (msg) {
  let lang = store.getState(msg.from.id).lang
  if (!lang) {
    const user = await dbManager.getUser({ id: msg.from.id })
    lang = (user || {}).language || config.defaultLanguage
    updateStore(msg, lang)
  }
  return lang
}

function updateStore (msg, lang) {
  store.update(msg.from.id, {lang: lang})
}

module.exports = {
  setLanguage,
  getLanguage
}
