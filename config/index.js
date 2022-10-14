module.exports = {
  telegram_api_key: process.env.TELEGRAM_TOKEN,
  database: process.env.MONGODB_URI,
  webhook_port: process.env.WEBHOOK_PORT || 443,
  externalUrl: process.env.EXTERNAL_URL,
  should_use_webhooks: process.env.USE_WEBHOOKS || false,
  defaultLanguage: 'en',
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    upload_url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`,
  },
  deckLimitPerUser: 50,
  shareLinkUrl: 'https://link.clashroyale.com/deck/en?deck='
}
