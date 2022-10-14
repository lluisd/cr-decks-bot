require('dotenv').config()
const mongoose = require('mongoose')
const Messenger = require('./lib/messenger')
const config = require('./config')
const messenger = new Messenger()

const port = process.env.PORT | 3000

mongoose.connect(config.database,  { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

messenger.listen(port)
  .then(() => {
    console.log('🤖  Listening to incoming messages on http://localhost:' + port)
  })
