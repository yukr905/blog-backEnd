const Router = require("express")
const {check, validationResult}= require("express-validator")
const Post = require("../models/Post")

const auth = require("../validation/auth-validation")
const router = Router()

router.post("/create",auth,
[
check("title","Название статьи должно быть больше 6 символов").isLength(6),
check("tags","Минимальная длинна 6 символов").isLength(6),
check("text","Минимальная длинна 10 символов").isLength(10),
check("imageUrl","строка").optional().isURL()
]
,async (req,res)=>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            console.log(errors)
            return res.status(404).json({message:"Ошибка при создание статьи валидация"})
        }
        const id = req.userId
        console.log(id)
        const doc = new Post({
            title:req.body.title,
            tags:req.body.tags,
            text:req.body.tags,
            imageUrl:req.body.imageUrl,
            user: id
        })
        const post = await doc.save()
        res.status(201).json(post)
    } catch (error) {
        console.log(error)
        return res.status(404).json({message:"Ошибка при создание статьи"})
    }
})
router.get("/:id",async(req,res)=>{
    try {
        const id = req.params.id
        const post = await Post.findOneAndUpdate({_id:id},
            {$inc:{countViews:1}},
            {returnDocument:"after"})
            res.json(post)
    } catch (e) {
        console.log(e)
        return res.status(404).json({message:"Ошибка при получение статьи"})
    }
})
router.get("/",async(req,res)=>{
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        return res.status(404).json({message:"Ошибка при получение статей"})
    }
})
router.delete("/delete/:id",auth,async(req,res)=>{
    try{
    const id = req.params.id
    await Post.findOneAndDelete({_id:id})
        res.status(200).json({success:true})
    }catch(e){
        console.log(e)
        res.status(500).json({message:"Что-то пошло не так"})
    }
})
router.patch("/change/:id",auth,
[
check("title","Название статьи должно быть больше 6 символов").isLength(6),
check("tags","Минимальная длинна 6 символов").isLength(6),
check("text","Минимальная длинна 10 символов").isLength(10)
],async (req,res)=>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            console.log(errors)
            return res.status(404).json({message:"Ошибка при создание статьи"})
        }
        const id = req.params.id
        await Post.findOneAndUpdate({_id:id},{
            title:req.body.title,
            tags:req.body.tags,
            text:req.body.text,
            imageUrl:req.body.imageUrl,
            user:req.userId
        },{returnDocument:"after"})
        res.json({success:true})
    } catch (error) {
        console.log(error)
        res.status(404).json({message:"Ошибка при обновление статьи"})
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