require('dotenv').config()
const multer = require('multer')
const multerS3 = require('multer-s3')
const path = require('path')

const s3 = require('../api/aws')

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    return cb(null, true)
  } else {
    cb(null, new Error('Images only'))
  }
  cb(new Error('Something goes wrong!'))
}

const imageUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    cacheControl: 'max-age=31536000',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      cb(
        null,
        new Date().toISOString().replace(/:/g, '-').replace('.', '_') +
          '-musicchat' +
          path.extname(file.originalname)
      )
    }
  }),
  fileFilter,
  limits: 2000000
})

module.exports = imageUpload
