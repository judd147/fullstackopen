const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI // Define the url using environment variable

console.log('connecting to', url)

// Connect to MongoDB
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Define the schema for a person
const personSchema = new mongoose.Schema({
  name: String,
  number: String
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