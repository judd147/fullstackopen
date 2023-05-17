const _ = require('lodash')
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
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}