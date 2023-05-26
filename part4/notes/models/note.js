/* THIS FLIE DEFINES THE MONGOOSE SCHEMA FOR NOTE */

const mongoose = require('mongoose')

// Define the schema for a note with validation rules
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId, // The id of user who created the note is referenced
    ref: 'User'
  }
})

// Change the configurable options of the schema
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // _id is in fact an object. The toJSON method we defined transforms it into a string just to be safe.
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Export the public interface of the module, which is the Note model
module.exports = mongoose.model('Note', noteSchema)