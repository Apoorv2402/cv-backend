var mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  // firstname: {
  //   type:String, 
  //   required:true
  // },
  // lastname:   {
  //   type:String, 
  //   required:true
  // },
  // usertype: {
  //   type:String,
  //   default: "reader"
  // },
  // pincode: {
  //   type: Number, 
  //   required:true
  // },
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);

