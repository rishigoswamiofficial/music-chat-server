const mongoose = require('mongoose')

const Schema = mongoose.Schema

const messageSchema = new Schema(
  {
    body: {
      type: String,
      required: true
    },
    media: String,
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Friends', messageSchema)
