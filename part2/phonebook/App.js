import { useState } from 'react'

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
const Person = ({ person, filter }) => {
  if (person.name.toLowerCase().includes(filter.toLowerCase())) {
    return (
      <p>{person.name} {person.number}</p>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addName = (event) => {
    event.preventDefault() //prevent dafault action of submitting the form and reload
    const NameObject = {name: newName, number: newNumber, id: persons.length + 1}
    const found = persons.find(person => person.name === newName) //check if the name is already in phonebook
    if (found === undefined) {
      setPersons(persons.concat(NameObject))
    }
    else {
      window.alert(`${newName} is already added to phonebook`) //issue warning to user
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

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      {persons.map(person => 
        <Person key={person.id} person={person} filter={filter}/>
      )}
    </div>
  )
}

export default App