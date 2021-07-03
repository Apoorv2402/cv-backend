var mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  title:  {
    type:String, 
    required:true, 
    unique:true
  },
  description: {
    type:String, 
    required:true
  },
  username:   {
    type:String, 
    required:true
  },
  category:   {
    type:Array, 
    required:true, 
  },
  postPicture: {
    type: Array,
    required:false
  }
},
{
  timestamps:true
}
);

module.exports =  mongoose.model("Post",PostSchema);

