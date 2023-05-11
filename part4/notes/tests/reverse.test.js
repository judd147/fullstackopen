const reverse = require('../utils/for_testing').reverse // import the reverse function

/* Individual test cases are defined with the test function
The first param is the description
The second param is a function which:
1.execute the functionality 2.verify the results using expect()
*/

test('reverse of a', () => {
  const result = reverse('a')

  expect(result).toBe('a')
})

test('reverse of react', () => {
  const result = reverse('react')

  expect(result).toBe('tcaer')
})

test('reverse of releveler', () => {
  const result = reverse('releveler')

  expect(result).toBe('releveler')
})