require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const authRoutes = require('./routes/authRoute')

const app = express()
const mongoDbUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@music-chat.8rt8o.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

// configure body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// routes
app.use('/auth', authRoutes)

// error handling middleware
app.use((err, req, res, next) => {
  console.log(err)
  const status = err.statusCode || 500
  const message = err.message
  const data = err.data
  res.status(status).json({ message, data })
})

mongoose
  .connect(mongoDbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(process.env.DB_PORT, function () {
      console.log('Server connected to database!!')
    })
  })
  .catch((err) => {
    console.log(err)
  })
