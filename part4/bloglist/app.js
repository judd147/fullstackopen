/* THIS FLIE USES MIDDLEWARES AND CONNECTS TO DATABASE */

const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors()) // use cors to allow for requests from all origins
//app.use(express.static('build')) // make express show static content
app.use(express.json()) // use express json parser to help access data
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter) // define the router and its base url

app.use(middleware.unknownEndpoint) // next to the last middleware
app.use(middleware.errorHandler) // this has to be the last loaded middleware

module.exports = app