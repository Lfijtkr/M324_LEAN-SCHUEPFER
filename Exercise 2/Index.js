const sum = (a, b) => {
  return a + b
}
module.exports = { sum }
const unusedVariable = 42
if (require.main === module) {
  console.log('Sum: ', sum(1, 2))
  console.log(sum(1, 2) == 4)
  console.log(myUndefinedVariable)
}
