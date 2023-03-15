import { useState, useEffect } from 'react'
import personService from './services/persons'

//render a filter field
const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with: <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

//render a form for user input
const PersonForm = ({ addName, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

//render names and numbers
const Person = ({ person, filter, handleDeletion }) => {
  if (person.name.toLowerCase().includes(filter.toLowerCase())) {
    return (
        <p>
          {person.name} {person.number}
          <button onClick={() => handleDeletion(person)}>delete</button>
        </p>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

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
        })
    }
    else {
      // replace the old number with a new one
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName) // find the person we want to modify
        const changedPerson = { ...person, number: newNumber } // copy the old name but update the number
        personService
          .update(changedPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== changedPerson.id ? person : returnedPerson)) // If id matched, reset with the person returned by the server.
        })
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