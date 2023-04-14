const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.tkkwpa0.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

// define the schema for a note and the matching model
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// creates a new note object
const note = new Note({
  content: 'HTML is Easy',
  important: true,
})

// retrieve objects from database
Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
})

// saves the object to the database
/*
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
*/