const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

/* If the length of the array is 0 then we return 0
Else, we use the reduce method to calculate the average
*/
const average = array => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average
}