const {Router} = require("express")
const User = require("../models/User")
const Post = require("../models/Post")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("../config/config.json")
const auth = require("../validation/auth-validation")
const {check,validationResult} =require("express-validator")
const router = Router()

router.post("/register",[
    check("fullname","Длинна имени должна быть больше 3 символов").isLength(3),
    check("email","Введите коректную почту").isEmail(),
    check("password","Пароль должен быть больше 6 символов").isLength(6)
],async(req,res)=>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:"Некоректные данные при регистрации"})
        }
        const {fullname,email,password} = req.body
        const candidate = await User.findOne({email})
        const candidate1 = await User.findOne({fullname})
        if(candidate1){
            return res.status(404).json({message:"Имя пользователя занято"})
        }
        if(candidate){
            return res.status(404).json({message:"Пользователь уже зарегистрирован"})
        }
        const passwordHash = await bcrypt.hash(password,10)
        const user = new User({fullname:fullname,email:email,password:passwordHash})
        await user.save()
        res.status(201).json({message:"Пользователь создан"})
        }
    catch (error) {
        console.log(error)
        return res.status(404).json({message:"Что-то пошло не так"})    
    }
})

router.post("/login",[
    check("email","Введите коректную почту").isEmail(),
    check("password","Пароль должен быть больше 6 символов").isLength(6)
],async(req,res)=>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})
        const decoded = await bcrypt.compare(password, user.password)
        if(user && decoded){
            const token = jwt.sign(
                {userId:user._id},
                config.jwtsecret,
                {expiresIn:"1d"}
                )
            return res.status(200).json({token,userId:user._id})
        }
        return res.status(404).json({message:"Неверный логин или пароль"})
    } catch (error) {
        console.log(error)
        return res.status(404).json({message:"Что-то пошло не так"}) 
    }
})
router.get("/",auth,async(req,res)=>{
    try {
        const posts = await Post.find({user:req.userId})
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({message:"Неудалось получить статьи"})
    }
})
module.exports = router