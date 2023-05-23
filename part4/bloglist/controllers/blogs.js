/* THIS FLIE DEFINES ROUTE HANDLERS */

const blogsRouter = require('express').Router() // create a new router object
const Blog = require('../models/blog') // import the database schema

// Route for fetching all resources
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs) // send as a JSON formatted string
})

// Route for fetching a single resource
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  // error handling
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// Route for adding a new resource
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // The title and url property must not be empty, respond with status code 400 bad request
  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0 // If the property does not exist, the expression will evaluate to 0
  })

  const savedBlog = await blog.save() // save the new object to database
  response.status(201).json(savedBlog) // respond with status code 201 created
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