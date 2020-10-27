require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const chalk = require('chalk')
const { validationResult } = require('express-validator')
const s3 = require('../api/aws')

const User = require('../models/User')

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed!')
      error.statusCode = 422
      error.data = errors.array()
      console.log(errors.array())
      throw error
    }
    if (!req.file) {
      const error = new Error('No image found!')
      error.statusCode = 422
      throw error
    }
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    const phone = req.body.phone
    const profilePic = req.file.location
    console.log(chalk.magentaBright(profilePic))
    const user = await User.findOne({ email })
    if (user) {
      const params = {
        Bucket: `${process.env.AWS_BUCKET_NAME}`,
        Key: req.file.key
      }
      await s3.deleteObject(params, function (err, data) {
        if (err) {
          console.log(err)
        }
        console.log(data)
      })
      const error = new Error('User already exists!')
      error.statusCode = 422
      throw error
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    if (!hashedPassword) {
      const error = new Error('Something went wrong!')
      error.statusCode = 500
      throw error
    }
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
      profilePic
    })
    console.log(chalk.blueBright(newUser))
    const token = jwt.sign(
      { email, userId: newUser._id.toString() },
      process.env.JWT_PRIVATE_KEY
    )
    res.status(200).json({
      message: 'User created successfully!!',
      userId: newUser._id.toString(),
      token
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.login = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  try {
    const user = await User.findOne({ email })
    if (!user) {
      const error = new Error('Invalid email or password')
      error.statusCode = 422
      throw error
    }
    const passwordMatched = await bcrypt.compare(password, user.password)
    if (!passwordMatched) {
      const error = new Error('Invalid email or password!')
      error.statusCode = 422
      throw error
    }
    const token = jwt.sign(
      { email, userId: user._id.toString() },
      process.env.JWT_PRIVATE_KEY
    )
    console.log(chalk.blueBright(user))
    res.status(200).json({
      message: 'User logged in!',
      userId: user._id.toString(),
      token
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
