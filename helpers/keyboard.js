function mainMenuKeyboard (t) {
  return [
    [{text: t.__('mainMenuOptions.show_decks')},{text: t.__('mainMenuOptions.new_deck')}],
    [{text: t.__('mainMenuOptions.change_language')}]
  ]
}

function getCardsMenu (t, availableCards, selectedCards, page, selectedRarities) {
  return getInlineKeyboard(
    createCardsKeyboard(t, availableCards, selectedCards, page, selectedRarities)
  )
}

function getLanguageMenu (t) {
  return getInlineKeyboard(
    languageKeyboard(t)
  )
}

function getMainMenu (t) {
  return getKeyboard(
    mainMenuKeyboard(t)
  )
}

function getEditMenu (t, deckId) {
  return getInlineKeyboard(
    [
      [
        {text: t.__('deckOptions.edit_name'), callback_data: 'editName~' + deckId},
      ],
      [
        {text: t.__('deckOptions.back'), callback_data: 'backMenu'}
      ]
    ]
  )
}

function getPagination (current, maxpage) {
  let keys = []
  if (current > 1) keys.push({text: `« 1`, callback_data: 'selectCardPage~' + 1})
  if (current > 2) keys.push({
    text: `‹ ${current - 1}`,
    callback_data: 'selectCardPage~' + (current - 1).toString()
  })
  keys.push({text: `· ${current} ·`, callback_data: 'nothing~' + current.toString()})
  if (current < maxpage - 1) keys.push({
    text: `${current + 1} ›`,
    callback_data: 'selectCardPage~' + (current + 1).toString()
  })
  if (current < maxpage) keys.push({
    text: `${maxpage} »`,
    callback_data: 'selectCardPage~' + maxpage.toString()
  })

  return keys
}

function _calculatePages (pageSize, elementsNum, fixedElementsNum, pagesNum = 0) {
  const totalFixedElements = pagesNum * fixedElementsNum
  const newPagesNum = Math.ceil((elementsNum + totalFixedElements) / pageSize)
  if (newPagesNum > pagesNum)
    return _calculatePages(pageSize, elementsNum, fixedElementsNum, newPagesNum)
  else
    return newPagesNum
}

function createCardsKeyboard (t, availableCards, selectedCards = [], page = 1, selectedRarities = []) {
  const pageSize = 21
  const pagesNum = _calculatePages(pageSize, availableCards.length, selectedCards.length)

  let cardKeys = []

  const filterTypes = _getCardRarities(selectedRarities, t);
  cardKeys.push(filterTypes)

  availableCards.sort((a, b) => {
      if (a.elixirCost > b.elixirCost) return 1
      else if (a.elixirCost < b.elixirCost) return -1
      else return a.name.localeCompare(b.name)
    }
  )
  let cards = selectedCards.concat(availableCards.slice((page - 1) * (pageSize - selectedCards.length), page * (pageSize - selectedCards.length)))

  const nums = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"];
  let selectedCount = 0;
  cards.forEach((card, i) => {
    let j = Math.floor(i / 3) + 1
    if (cardKeys[j] === undefined) cardKeys[j] = []

    let isSelected = selectedCards.find(selected => selected.id === card.id)
    let text = t.__('card.' + card.name)
    if (isSelected) {
      text = nums[selectedCount] + ' ' + text
      selectedCount++
    }

    cardKeys[j].push({text: text, callback_data: 'cardSelected~' + page + ':' + card.id})
    cards.push(card)
  })
  cardKeys.push(getPagination(parseInt(page), pagesNum))

  const buttons = [
    {text: t.__('createDeckOptions.cancel'), callback_data: 'cancelDeck'}
  ]

  if(selectedCards.length === 8 ){
    buttons.unshift({text: t.__('createDeckOptions.create'), callback_data: 'createDeck'})
  }

  cardKeys.push(buttons)
  return cardKeys
}

function _getCardRarities (selectedRarities, t) {
  let filterRaritiesButtons = [];
  const rarities = ["Common", "Rare", "Epic", "Legendary", "Champion"];
  rarities.forEach(r => {
    let text = t.__('createDeckOptions.' + r.toLowerCase())
    if (selectedRarities.includes(r)) text = '☑️' + text

    filterRaritiesButtons.push({text: text, callback_data: 'filterDeck~' + r})
  })
  return filterRaritiesButtons;
}

function languageKeyboard (t) {
  return [
    [
      {text: t.__('languageOptions.english'), callback_data: 'changeLanguage~en'},
      {text: t.__('languageOptions.spanish'), callback_data: 'changeLanguage~es'}
    ],
  ]
}

function getInlineKeyboard (keyboard) {
  const options = {
    reply_markup: {
      inline_keyboard: keyboard
    },
  }

  options.reply_markup = JSON.stringify(options.reply_markup)
  return options
}

function getKeyboard (keyboard) {
  const options = {
    reply_markup: {
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true
    },
    disable_web_page_preview: 'true',
  }

  options.reply_markup = JSON.stringify(options.reply_markup)
  return options
}

module.exports = {
  getMainMenu,
  getLanguageMenu,
  getCardsMenu,
  getEditMenu
}
