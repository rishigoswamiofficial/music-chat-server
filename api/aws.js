require('dotenv').config()
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`
  }
})

module.exports = s3
