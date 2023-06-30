/* THIS FLIE DEFINES CUSTOM MIDDLEWARES */

const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// custom Express error handler
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' }) // respond with status code 400 Bad Request
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message }) // handle validation errors
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: error.message }) // handle missing or invalid token
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' }) // handle expired token
  }

  next(error) // else, passes the error forward to the default Express error handler
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}