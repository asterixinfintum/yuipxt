function addAndConvertToNumber(num1, num2) {
  const result = (num1 + num2).toFixed(8);
  return parseFloat(result);
}

function subtractAndConvertToNumber(num1, num2) {
    const result = (num1 - num2).toFixed(8);
    return parseFloat(result);
}

export default { addAndConvertToNumber, subtractAndConvertToNumber };