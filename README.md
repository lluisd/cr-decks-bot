# Clash royale decks Telegram Bot

You can save more than 5 decks with this bot. Share your deck link with this bot or create a new one by using the bot menu. Then you can list all your decks and use / modify / delete anyone.

## Configure it

You will need to configure the confi file in config/index.js by:
1. Adding your Telegram API Key

```javascript
telegram_api_key: process.env.TELEGRAM_TOKEN
```

2. Database uri based on MONGO DB

```javascript
  database: process.env.MONGODB_URI
```
3. A Cloudinary account

```javascript
  cloudinary: {
    url: process.env.CLOUDINARY_IMAGES_UPLOAD_PATH,
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
```

## Demo

Test it with with that telegram bot https://t.me/CrDecksBot

