/**
 * Parse search query string into conditions array
 * Examples: 
 * - "price>10" => [{ field: "price", operator: ">", value: 10 }]
 * - "pages>100 AND genre==Fantasy" => [{ field: "pages", operator: ">", value: 100 }, { field: "genre", operator: "==", value: "Fantasy" }]
 * 
 * @param {string} queryString - The search query string
 * @returns {Array} Array of search conditions
 */
const parseSearchQuery = (queryString) => {
    if (!queryString) {
      return [];
    }
  
    // Handle multiple conditions (we'll separate the logic operator in the searchBooks function)
    const parts = queryString.split(/\s+(?:AND|OR)\s+/);
    
    return parts.map(part => {
      // Match patterns like field>value, field<value, field==value
      const matches = part.match(/(\w+)(==|>=|<=|>|<|contains)(.+)/);
      
      if (!matches) {
        return null;
      }
      
      const [, field, operator, rawValue] = matches;
      let value = rawValue.trim();
      
      // Convert value to the appropriate type
      if (!isNaN(value) && field !== 'isbn') {
        // Convert to number
        value = Number(value);
      } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
        // Convert to boolean
        value = value.toLowerCase() === 'true';
      }
      
      return { field, operator, value };
    }).filter(Boolean); // Remove any null results
  };
  
  module.exports = {
    parseSearchQuery
  };