# Clash royale decks Telegram Bot

You can save more than 5 decks with this bot. Share your deck link with this bot or create a new one by using the bot menu. Then you can list all your decks and use / modify / delete anyone.

## Configure it

You will need to configure the **config/index.js** by specifying the next environment variables (can be don by creating a .env file in the root)


1. Your Telegram API Key provided by BotFather bot

```javascript
TELEGRAM_TOKEN
```

2. Database uri based on MONGO DB

```javascript
MONGODB_URI
```

3. A Cloudinary account

```javascript
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

4. ENABLING WEBHOOKS (ONLY FOR PROD)

```javascript
USE_WEBHOOKS=1
HOST
PORT
EXTERNAL_URL
```

## Demo

Test it with that telegram bot https://t.me/CrDecksBot (it takes some seconds to wake up)

![image](https://user-images.githubusercontent.com/7629843/110979830-68e97d00-8365-11eb-988a-7be061d5ff10.png)

