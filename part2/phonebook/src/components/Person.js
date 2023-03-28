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
export default Person