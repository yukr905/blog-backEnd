const jwt = require("jsonwebtoken")
const config = require("../config/config.json")
module.exports =  async(req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1]
    if(token){
        try {
            const decoded = await jwt.verify(token,config.jwtsecret)
            if(!decoded){
                return res.status(404).json({message:"Доступ запрещен"})
            }
            req.userId = decoded.userId
            next()
        } catch (error) {
            console.log(error)
            return res.status(403).json({message:"Что-то пошло не так"})
        }
    }
}