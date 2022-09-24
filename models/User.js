const {Schema, model,Types} = require("mongoose")

const User = new Schema({
    fullname:{type:String,require:true,unique:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    link:{type:Types.ObjectId,ref:"Post"}
},{
    timestamps:true
})

module.exports = model("User" , User)