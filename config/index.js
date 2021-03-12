module.exports = {
  telegram_api_key: process.env.TELEGRAM_TOKEN,
  database: process.env.MONGODB_URI,
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 443,
  externalUrl: process.env.EXTERNAL_URL,
  should_use_webhooks: process.env.USE_WEBHOOKS || false,
  defaultLanguage: 'en',
  cloudinary: {
    url: process.env.CLOUDINARY_IMAGES_UPLOAD_PATH,
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  },
  deckLimitPerUser: 50,
  shareLinkUrl: 'https://link.clashroyale.com/deck/en?deck='
}
