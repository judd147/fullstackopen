/* THIS FLIE DEFINES THE MONGOOSE SCHEMA */

const mongoose = require('mongoose')

// Define the schema for a note with validation rules
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

// Change the configurable options of the schema
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // _id is in fact an object. The toJSON method we defined transforms it into a string just to be safe.
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Export the public interface of the module, which is the Note model
module.exports = mongoose.model('Blog', blogSchema)