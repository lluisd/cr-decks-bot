const cloudinary = require('cloudinary')
const config = require('../config')

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
})

function saveImage (image, folder) {
  return new Promise((resolve) => {
    return cloudinary.v2.uploader.upload_stream({
      folder: folder,
      format: 'jpg',
    }, function (error, result) {
      if (error)throw error
      resolve(result.public_id)
    }).end(image.buffer)
  })
}

function deleteImage (id) {
  return cloudinary.v2.uploader.destroy(id)
    .then((result) => {
      return result
    })
}

function exists (id) {
  return new Promise((resolve, reject) => {
    return cloudinary.v2.uploader.explicit(id,
      {
        type: 'upload'
      }
      , function (error, result) {
        if (error) reject(error)
        else resolve(result)
      })
  })
}

module.exports = {
  saveImage,
  deleteImage,
  exists
}