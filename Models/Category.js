var mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name:  {
    type:String, 
    required:true, 
    unique:true
  }
},
{
  timestamps:true
}
);

module.exports =  mongoose.model("Category",CategorySchema);

