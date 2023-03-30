const http = require('http') //CommonJS module version of import http from 'http'(ES6 module)

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

//an event handler is called when an HTTP request is made to the server's address
const app = http.createServer((request, response) => { 
  response.writeHead(200, { 'Content-Type': 'application/json' }) //set status code and Content-Type header
  response.end(JSON.stringify(notes)) //set content
})

const PORT = 3001
app.listen(PORT) //bind the http server assigned to the app variable, to listen to HTTP requests sent to port 3001
console.log(`Server running on port ${PORT}`)