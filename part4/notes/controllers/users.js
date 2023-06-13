/* THIS FLIE DEFINES USER ROUTE HANDLERS */

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Route for fetching all resources
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', { content: 1, important: 1 }) // the note ids of the user document will be replaced by the referenced note documents, keep specific fields
  response.json(users)
})

// Route for adding a new resource
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

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