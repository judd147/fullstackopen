const express = require('express')
const app = express() //create an express application

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})