import { useState } from 'react'

const Statistics = ({ good, neutral, bad, total, avg, pos}) => {
  if (total === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <StatisticLine text="good" value ={good} />
      <StatisticLine text="neutral" value ={neutral} />
      <StatisticLine text="bad" value ={bad} />
      <StatisticLine text="all" value ={total} />
      <StatisticLine text="average" value ={avg} />
      <StatisticLine text="positive" value ={pos*100+'%'} />
    </table>
  )
}

const StatisticLine = ({ text, value }) => (
  <tbody>
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  </tbody>
)

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [avg, setAvg] = useState(0)
  const [pos, setPos] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    const updatedTotal = total + 1
    setGood(updatedGood)
    setTotal(updatedTotal)
    setAvg((updatedGood - bad)/updatedTotal)
    setPos(updatedGood/updatedTotal)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    const updatedTotal = total + 1
    setNeutral(updatedNeutral)
    setTotal(updatedTotal)
    setAvg((good - bad)/updatedTotal)
    setPos(good/updatedTotal)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    const updatedTotal = total + 1
    setBad(updatedBad)
    setTotal(updatedTotal)
    setAvg((good - updatedBad)/updatedTotal)
    setPos(good/updatedTotal)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} avg={avg} pos={pos}/>
    </div>
  )
}

export default App
