import express from "express";
import {body, validationResult} from "express-validator";
import User from '../models/user'
import bcrypt from "bcryptjs";
import JWT from 'jsonwebtoken'

const router = express.Router();

router.post(
  "/signup",
  body("email").isEmail().withMessage("the email is invalid"),
  body("password").isLength({ min: 5 }).withMessage("the password is to short"),
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array().map((error) => {
        return {
          msg: error.msg,
        };
      });
      return res.json({ errors, data: null });
    }

    
    const { email, password } = req.body;

    // await User.create({email,password})

    const user = await User.findOne({ email });
    if(user){
        return res.json({
            errors: [
                {msg: 'Email already in use'}
            ],
            data:null
        })
    }

    const hashedPassword= await bcrypt.hash(password,10)

    
    const newuser = await User.create({email,password:hashedPassword})
    const token = await JWT.sign(
      { email: newuser.email },
      "maniadkjsfsadbfkjadfkj",
      {
          expiresIn: 360000
      }
    );



    res.json({
      errors: [],
      data: {
        token,
        user: {
          id: newuser._id,
          email: newuser.email
        },
      },
    });
  }
);

router.post('/login', async(req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.json({
            errors:[{
                msg: 'InValid Credentials'
            }],
            data: null
        })
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
         return res.json({
           errors: [
             {
               msg: "InValid Credentials",
             },
           ],
           data: null,
         });
    }

    const token = await JWT.sign(
      { email: user.email },
      "maniadkjsfsadbfkjadfkj",
      {
        expiresIn: 360000,
      }
    );

    return res.json({
        token,
        user:{
            id: user._id,
            email: user.email
        }
    })


})


export default router;