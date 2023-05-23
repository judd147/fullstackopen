const mongoose = require('mongoose')
const supertest = require('supertest')
const listHelper = require('../utils/list_helper')
const app = require('../app') // import the Express application
const api = supertest(app) // superagent object that can make HTTP requests to the backend
const Blog = require('../models/blog') // import the database schema

beforeEach(async () => {
  await Blog.deleteMany({}) // clear out database
  const blogObjects = listHelper.blogs.map(blog => new Blog(blog)) // create an array of Mongoose objects (Blog)
  const promiseArray = blogObjects.map(blog => blog.save()) // create an array of promises for saving blogs to DB
  await Promise.all(promiseArray) // wait until every promise for saving a blog is finished
}, 200000) // set timeout

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200) // verify responded status code
    .expect('Content-Type', /application\/json/) // verify the Content-Type header using regex
}, 200000) // set timeout

// Test for GET All
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  // execution gets here only after the HTTP request is complete
  expect(response.body).toHaveLength(listHelper.blogs.length)
})

// Test for ID Existence
test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.map(blog => {
    expect(blog.id).toBeDefined()
  })
})

// Test for POST
test('a valid blog can be added', async () => {
  const newBlog = {
    'title': 'Sorry just so quickly, it is James Hype, bitch',
    'author': 'James Hype',
    'url': 'https://csdn/checkthings.com',
    'likes': 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await listHelper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(listHelper.blogs.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  expect(titles).toContain('Sorry just so quickly, it is James Hype, bitch')
})

// Test for missing Likes POST
test('missing likes should default to zero', async () => {
  const newBlog = {
    'title': 'I am drunk and I am high, and I am in Chicago',
    'author': 'John Summit',
    'url': 'https://offthegridrecord/origin-js.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await listHelper.blogsInDb()
  const addedBlog = blogsAtEnd.filter(blog => blog.title === 'I am drunk and I am high, and I am in Chicago')
  expect(addedBlog[0].likes).toBe(0)
})

// Test for missing title or url POST
test('missing title or url is bad request', async () => {
  const noUrlBlog = {
    'title': 'The less you give it to me the more I want it',
    'author': 'James Hype',
    'likes': 257
  }
  const noTitleBlog = {
    'author': 'judd147',
    'url': 'bet365.com',
    'likes': 500
  }
  await api
    .post('/api/blogs')
    .send(noUrlBlog)
    .expect(400)
  await api
    .post('/api/blogs')
    .send(noTitleBlog)
    .expect(400)
})

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listHelper.empty_blog)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listHelper.blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('of empty list is empty', () => {
    const result = listHelper.favoriteBlog(listHelper.empty_blog)
    expect(result).toEqual([])
  })

  test('when list has only one blog, return that blog', () => {
    const result = listHelper.favoriteBlog(listHelper.listWithOneBlog)
    expect(result).toEqual(listHelper.listWithOneBlog[0])
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(listHelper.blogs)
    expect(result).toEqual({
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    })
  })
})

describe('most blogs', () => {
  test('of empty list is empty', () => {
    const result = listHelper.mostBlogs(listHelper.empty_blog)
    expect(result).toEqual([])
  })

  test('when list has only one blog, return the author and 1', () => {
    const result = listHelper.mostBlogs(listHelper.listWithOneBlog)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(listHelper.blogs)
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('most likes', () => {
  test('of empty list is empty', () => {
    const result = listHelper.mostLikes(listHelper.empty_blog)
    expect(result).toEqual([])
  })

  test('when list has only one blog, return the author and likes', () => {
    const result = listHelper.mostLikes(listHelper.listWithOneBlog)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 5 })
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(listHelper.blogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })
})

afterAll(async () => {
  await mongoose.connection.close() // close the database connection after all tests finish running
})