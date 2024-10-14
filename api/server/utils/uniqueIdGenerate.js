const { ObjectId } = require('mongodb');

function uniqueIdGenerate() {
  const timestamp = ObjectId().getTimestamp();
  const randomPart = Math.floor(Math.random() * 10000); // Generate a random number

  // Concatenate the timestamp and random part to form a unique number
  const uniqueNumber = parseInt(timestamp.getTime().toString() + randomPart.toString());

  return uniqueNumber;
}

export default uniqueIdGenerate;