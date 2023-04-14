const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.tkkwpa0.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

// define the schema for a person and the matching model
const personSchema = new mongoose.Schema({
  //id: Number,
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

// retrieve all objects from database if password is the only parameter
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
    })
}

// saves the object to the database if more parameters are provided
if (process.argv.length > 3) {
    // creates a new person object based on command line input
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
    console.log(`Added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
    })
}
