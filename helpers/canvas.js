const {createCanvas, loadImage} = require('canvas')

function drawCanvas (deck) {
  const canvas = createCanvas(204, 119, 'png')
  const ctx = canvas.getContext('2d')

  const promises = []
  deck.cards.forEach((card, i) => {
    promises.push(loadImage('images/' + card.name + '.png').then((image) => {
      ctx.drawImage(image, (i % 4) * 51, Math.floor(i / 4) * 59, 51, 59)
    }).catch((error) =>
      console.log(error)))
  })

  return Promise.all(promises).then(() => {
    const buf = canvas.toBuffer()
    return {buffer: buf}
  })
}

module.exports = {
  drawCanvas
}