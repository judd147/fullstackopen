const _ = require('lodash')
const Blog = require('../models/blog') // import the database schema

const empty_blog = []
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]
const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  // sum the likes from all blogs
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0) // initial value to increment is 0
}

const favoriteBlog = (blogs) => {
  // get the max of likes from all blogs
  const reducer = (max, item) => {
    return max.likes > item.likes
      ? max
      : item
  }
  return blogs.length === 0
    ? []
    : blogs.reduce(reducer, blogs[0])
}

//What is the difference between maxby and max?
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return []
  }
  const agg_blogs = _.countBy(blogs, 'author')
  const result = {
    'author': _.maxBy(_.keys(agg_blogs), (o) => agg_blogs[o]),
    'blogs': _.max(_.values(agg_blogs))
  }
  return result
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return []
  }
  // get total likes for each author
  const reducer = (dict, { author, likes }) => {
    dict[author] = dict[author] || 0 // if dict[author] doesn't exist, initiate its likes to 0
    dict[author] += likes
    return dict
  }
  const agg_blogs = blogs.reduce(reducer, {})
  const result = {
    'author': _.maxBy(_.keys(agg_blogs), (o) => agg_blogs[o]),
    'likes': _.max(_.values(agg_blogs))
  }
  return result
}

module.exports = {
  empty_blog,
  listWithOneBlog,
  blogs,
  blogsInDb,
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}