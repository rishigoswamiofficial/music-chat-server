const express = require('express')
const { body } = require('express-validator')

const imageUpload = require('../middlewares/imageUpload')
const authController = require('../controllers/authController')
const User = require('../models/User')

const router = express.Router()

router.post(
  '/signup',
  imageUpload.single('profilePic'),
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then((user) => {
            if (user) {
              return new Error('Email already exists!')
            }
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 8, max: 20 }),
    body('phone').trim().isMobilePhone('any')
  ],
  authController.signup
)

router.post('/login', authController.login)

module.exports = router
