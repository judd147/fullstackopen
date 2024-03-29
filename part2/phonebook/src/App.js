import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  //Initialize data from server
  const hook = () => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }
  useEffect(hook, [])

  const addName = (event) => {
    event.preventDefault() //prevent dafault action of submitting the form and reload
    const NameObject = {name: newName, number: newNumber}
    const found = persons.find(person => person.name === newName) //check if the name is already in phonebook
    if (found === undefined) {
      // send user input data to server
      personService
        .create(NameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessage(`added ${newName}`)
        })
        .catch(error => {
          setMessage(`${error.response.data.error}`) // handle validation errors
          console.log(error.response.data.error)
        })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    else {
      // replace the old number with a new one
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName) // find the person we want to modify
        const changedPerson = { ...person, number: newNumber } // copy the old name but update the number
        personService
          .update(changedPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== changedPerson.id ? person : returnedPerson)) // If id matched, reset with the person returned by the server
            setMessage(`changed ${newName}'s number`)
          })
          .catch(error => {
            setMessage(`Information of ${newName} has already been removed from server`)
            console.log(error)
          })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    }
    //reset user input
    setNewName('')
    setNewNumber('')
  }

  //Track user input change of NAME
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  //Track user input change of NUMBER
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  //Track user input change of FILTER
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleDeletion = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(person.id)
        setPersons(persons.filter(p => p.id !== person.id))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      {persons.map(person => 
        <Person key={person.id} person={person} filter={filter} handleDeletion={handleDeletion}/>
      )}
    </div>
  )
}

export default App