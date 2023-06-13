/* THIS FLIE DEFINES LOGIN FUNCTIONALITY */

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username }) // search for the user from database by the username
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash) // check if the password is correct

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password' // respond with 401 unauthorized
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET) // a token is created

  response
    .status(200) // respond with status code 200 OK
    .send({ token, username: user.username, name: user.name }) // The generated token and the username of the user are sent back
})

module.exports = loginRouter