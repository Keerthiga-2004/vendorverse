const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  name:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true,
    unique:true
  },

  password:{
    type:String,
    required:true
  },

  phone:{
    type:String,
    default:""
  },

  address:{
    type:String,
    default:""
  },

  city:{
    type:String,
    default:""
  },

  role:{
    type:String,
    enum:["user","vendor","admin"],
    default:"user"
  },

  // Vendor Fields

  shopName:{
    type:String,
    default:""
  },

  category:{
    type:String,
    default:""
  },

  description:{
    type:String,
    default:""
  },

  openingHours:{
    type:String,
    default:""
  },

  profileImage:{
    type:String,
    default:""
  },

  coverImage:{
    type:String,
    default:""
  },

  isOpen:{
    type:Boolean,
    default:true
  },
  emoji: {
  type: String,
  default: "🏪"
}

},
{
  timestamps:true
});

module.exports = mongoose.model("User", userSchema);