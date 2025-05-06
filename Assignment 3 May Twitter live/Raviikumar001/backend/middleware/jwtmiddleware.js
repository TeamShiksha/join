const jwt = require('jsonwebtoken');
require('dotenv').config();
function authenticateToken(req, res, next) {    
    const authHeader = req.headers['authorization'];
    // console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]; // Extract token 
    // console.log(token);
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' }); 
    }
  
    try {
      const secret = process.env.SECRET_KEY;
      console.log(secret)
      const decoded = jwt.verify(token, secret);
  
    
      const userId = decoded.userId;  
      req.userId = userId; 
  
    
      if (decoded.exp < Date.now() / 1000) { 
        return res.status(401).json({ message: 'Unauthorized: Token expired' });
      }
  
    
  
      next(); 
    } catch (err) {
      return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }
  }
  

  module.exports = authenticateToken