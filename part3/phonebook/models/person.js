const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI // Define the url using environment variable

console.log('connecting to', url)

// Connect to MongoDB
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Define the schema for a person with validation rules
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d+/.test(v) // match 2 or 3 numbers and multiple numbers separated by "-"
      },
    }
  }
})

// Change the configurable options of the schema
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // _id is in fact an object. The toJSON method we defined transforms it into a string just to be safe.
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Export the public interface of the module, which is the Person model
module.exports = mongoose.model('Person', personSchema)