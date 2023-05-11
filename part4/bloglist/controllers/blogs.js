/* THIS FLIE DEFINES ROUTE HANDLERS */

const blogsRouter = require('express').Router() // create a new router object
const Blog = require('../models/blog') // import the database schema

// Route for fetching all resources
blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs) // send as a JSON formatted string
  })
})

// Route for fetching a single resource
blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id).then(blog => {
    // error handling
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  }) // additional catch if promise is rejected
    .catch(error => next(error)) // continue to the custom error handler middleware
})

// Route for adding a new resource
blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  blog.save().then(savedBlog => { // save the new object to database
    response.status(201).json(savedBlog)
  })
    .catch(error => next(error)) // continue to the custom error handler middleware
})

/* Route for deleting resources
blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id).then(() => {
    response.status(204).end() // respond with status code 204 no content
  })
    .catch(error => next(error)) // continue to the custom error handler middleware
})
*/

/* Route for updating resources
blogsRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  Blog.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' }) // cause our event handler to be called with the new modified document
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error)) // continue to the custom error handler middleware
})
*/
module.exports = blogsRouter