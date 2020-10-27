const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 20
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    profilePic: {
      type: String,
      required: true
    },
    friends: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        requestSent: Boolean,
        requestReceived: Boolean,
        messagesSent: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
        messagesRecieved: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
