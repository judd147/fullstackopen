/* THIS FLIE DEFINES USER ROUTE HANDLERS */

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Route for fetching all users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 }) // the blog ids of the user document will be replaced by the referenced blog documents, keep specific fields
  response.json(users)
})

// Route for creating users
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  // check the length of original password
  if (password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  const saltRounds = 10 // ~10 hashes/sec
  const passwordHash = await bcrypt.hash(password, saltRounds) // store the hash of the password

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter