const {Schema,model} = require("mongoose");
const commentSchema = new Schema({
postedBy:{
    type: Schema.Types.ObjectId,
    required:true,
    ref:"Users"
},
postId:{
type:Schema.Types.ObjectId,
required:true,
ref:"posts"
},
text:{
    type:String,
    required:true
},
parentComment:{
    type:Schema.Types.ObjectId,
    ref:"comments",
    default:null
},
commentedAt:{
    type:Date,
default: Date.now()
}, 
replies:[{
    type: Schema.Types.ObjectId,
    ref: "comments"
}]
});
commentSchema.pre("find", function( next){
    this.populate({path:"replies",
populate:{path:"postedBy"}
})
    next()
})
const Comment = new model("comments", commentSchema);
module.exports = Comment;