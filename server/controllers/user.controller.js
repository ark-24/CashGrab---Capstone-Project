import User from '../mongodb/models/user.js';
import bcrypt from 'bcryptjs'
import Jwt  from 'jsonwebtoken';
import alert from 'alert';

const getUser = async (req,res) => {
    try {
        const userId = req.params.userId; 
    
        const user = await User.findOne({ _id: userId });
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

const getAllUser = async (req,res) => {
  try {
  
      const user = await User.find({});
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};


const registerUser = async (req,res) => {

    try {
        const { name, email,avatar} = req.body;
        const password = req.body?.password;

        const userExists = await User.findOne({email});

        if (userExists) return res.status(200).json(userExists,{exists: true});

        if (password && password !== undefined)
        {
            const newPassword = await bcrypt.hash(password, 10)
            const newUser = await User.create({
                name, 
                email,
                avatar,
                password: newPassword
            })
        res.status(200).json(newUser);

        }
        else {
        const newUser = await User.create({
            name, 
            email,
            avatar
        })
        res.status(200).json(newUser);

    }

    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
};
const loginUser = async (req, res) => {
    const user = await User.findOne({
      email: req.body.email,
    });
  
    if (!user) {
      return res.status(401).json({ status: 'error', error: 'Invalid login' });
    }
  
    const secret = '+23SZshiV9XXs8FSC/q7zBz/dERxZdPA4JWjhD/GQNqC7psPtaQYt1XGKulLiRfCbR9HEUwyShQeYD4xzFUo7ZIuAjwGBJFBH6jzmuQzH1st9XWMatMDW9exb+eFQstqtqUPYKPnLRKGVbs2vDx0jz6YtLFP3wJukxGQxwl4GtOVNSYODqRhiO6Ee5T5427OmWUAf0MKzLuT9+U4WltmAcx6HhGFZeljkO9g4FD8TLp3zWdDbxcDGmYmS4ZflRlQw63SqAgPr4Pa4b7FfMNGTMd8VFUqHpPh9xQ3JDE/VBuDYFbqpFp6ogh97CiGQJUMMlQ7wwHA6+d/3z2F48nykA==';
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
  
    if (isPasswordValid) {
      const token = Jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        secret
      );
      return res.status(200).json({ status: 'ok', user: user, message: "Login Successful" });
    } else {
      return res.status(500).json({message:'invalid login credentials' });
    }
  };
  
const createUser = async (req,res) => {

    try {
        const { name, email,avatar} = req.body;
        const password = req.body?.password;

        const userExists = await User.findOne({email});

        if (userExists) return res.status(200).json(userExists);

        if (password && password !== undefined)
        {
            const newPassword = await bcrypt.hash(password, 10)
            const newUser = await User.create({
                name, 
                email,
                avatar,
                password: newPassword
            })
        res.status(200).json(newUser);

        }
        else {
        const newUser = await User.create({
            name, 
            email,
            avatar
        })
        res.status(200).json(newUser);

    }

    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
    
};

const getUserInfoByID = async (req,res) => {};


export {
    getUser,
    getAllUser,
    createUser,
    getUserInfoByID,
    registerUser,
    loginUser
}