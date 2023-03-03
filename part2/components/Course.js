const Header = (props) => {
    // renders the name of course
    return (
        <h1>{props.course}</h1>
    )
}
  
const Content = ( {parts} ) => {
// renders the parts and their number of exercises
    return (
        <div>
        {parts.map(part => 
            <Part key={part.id} part={part}/>
        )}
        </div>
    )
}

const Part = ( {part} ) => {
    return (
        <p>{part.name} {part.exercises}</p>
    )
}

const Total = ( {parts} ) => {
    // renders the total number of exercises
    const total = parts.reduce((accumulator, currentValue) => accumulator + currentValue.exercises, 0)
    return (
        <b>total of {total} exercises</b>
    )
}
  
const Course = ({ course }) => {
    return (
      <div>
        <Header course={course.name}/>
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
      </div>
    )
}

export default Course