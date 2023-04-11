const express = require('express')
const app = express() //create an express application
app.use(express.json()) //use express json parser to help access data

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

//define two routes to the application
//The first route defines an event handler that handles HTTP GET requests made to the application's root
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>') //the server respond to the HTTP request by sending the string Hello World!
})

//The second route defines an event handler that handles HTTP GET requests made to the notes path of the application
app.get('/api/notes', (request, response) => {
  response.json(notes) //send the notes array as a JSON formatted string
})

//Route for fetching a single resource
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id) //convert id to integer to match notes.id
  const note = notes.find(note => note.id === id)

  //if the note is undefined(false), respond with status 404
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

//Route for deleting resources
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end() //respond with status code 204 no content
})


const generateId = () => {
  //if notes is not empty, compute maxID; otherwise maxID is zero
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id)) //Math.max can't take an array which can be transformed into individual numbers by using the spread syntax
    : 0
  return maxId + 1
}

//Route for adding a new note
app.post('/api/notes', (request, response) => {
  const body = request.body //The event handler can access the data from the body property of the request object
  //The content property may not be empty, respond with status code 400 bad request
  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false, //If the property does not exist, the expression will evaluate to false
    id: generateId(),
  }

  notes = notes.concat(note) //append the new note
  response.json(note)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
