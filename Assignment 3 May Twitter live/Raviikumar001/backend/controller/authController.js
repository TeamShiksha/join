const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const login = async (req, res, next) => {
    console.log('hi');
    try {
      const { email, password } = req.body;

      if(email === ''|| password === '')
    {
        return res.status(400).json({message: "Fields are empty"});
    }
    if(password.length <4){
        return res.status(400).json({message: "Password field is too short."});
    }
  
      const user = await User.findOne({ email: email });
      console.log(user);
  
      if (!user) {
        return res.status(401).json({ message: "Email does not Exist" });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log(passwordMatch);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: "Password is incorrect" });
      }
  
      const userWithoutPassword = { ...user.toObject(), password: undefined };
  
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: '1d',
      });
  
      return res.status(200).json({
        token,
        user: userWithoutPassword,
        message: "User Authenticated",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Login failed' });
    }
  };
  






const register = async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    if(email === ''|| password === '')
    {
        return res.status(400).json({message: "Fields are empty"});
    }
    if(password.length <4){
        return res.status(400).json({message: "Password field is too short."});
    }

    User.findOne({ email: email })
      .then(async (doc) => {
        if (doc) {
          return res.status(409).json({ message: "User already Exists" });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
  
          const newUser = new User({
            email: email,
            password: hashedPassword
          });
          console.log(newUser)
          await newUser.save();

          const userWithoutPassword = { ...newUser.toObject(), password: undefined };

          const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
            expiresIn: '1d',
          });
      

          return res.status(200).json({ message: "User Created",
            user: userWithoutPassword,
            token

        
        });
        }
      })
      .catch((err) => {
        return res.status(500).json({ message: 'Error creating user', error: err.message })

      });
  };
  

  module.exports = {
    register,
    login
  }