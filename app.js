const mongoose = require('mongoose')
const Messenger = require('./lib/messenger')
const config = require('./config')
const messenger = new Messenger()

mongoose.connect(config.database,  { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

messenger.listen()
  .then(() => {
    console.log('🤖  Listening to incoming messages')
  })
