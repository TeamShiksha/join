const fs = require('fs');
const path = require('path');

const readBooksData = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../books.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading books data:', error);
    return [];
  }
};

const writeBooksData = (data) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, '../books.json'),
      JSON.stringify(data, null, 2),
      'utf8'
    );
    return true;
  } catch (error) {
    console.error('Error writing books data:', error);
    return false;
  }
};

module.exports = {
  readBooksData,
  writeBooksData
};
