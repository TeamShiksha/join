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