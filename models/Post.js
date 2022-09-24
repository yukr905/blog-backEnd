const {Schema,model,Types} = require("mongoose")

const Post = new Schema({
    title:{type:String,require:true,unique:true},
    tags:{type:String,require:true},
    text:{type:String,require:true},
    countViews:{type:Number,require:true,default:0},
    user:{ type: Types.ObjectId,ref: 'User'},
    imageUrl:String
},{
    timestamps: true
})

module.exports = model("Post",Post)