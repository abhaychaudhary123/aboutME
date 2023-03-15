const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email ID already Present"],
    validate: function (value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email not valid");
      }
    }
  },
  phonenumber: {
    type: String,
    required: true,
    validate: function (value) {
      if (!validator.isMobilePhone(value, "any")) {
        throw new Error("Invalid phone number");
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 3
  },
  confirmpassword: {
    type: String,
    required: true,
    minlength: 3
  },
  profileName: {
    type: String,
    required: true,
    default:"John Doe"
  },
  profileEmail: {
    type: String,
    required: true,
    default:"johndoe@example.com"
  },
  profileAddress: {
    type: String,
    required: true,
    default:"New Street - NewYork"
  },
  profileSkills: [{
    skills:
    {
      type: String,
      required:true
    }
   }],
   profileQualifications: [{
    qualificationType:
    {
      type: String,
      required:true
    },
    school:
    {
      type: String,
      required:true
    },
    board:
    {
      type: String,
      required:true
    },
    cgpa:
    {
      type: String,
      required:true
    },
    year:
    {
      type: String,
      required:true
    }
}],
  profileAchievement:[{
    Achievement:
    {
      type: String,
      required:true
    }
  }],
  profileProjects:[{
    projects:
    {
      type: String,
      required:true
    }
  }],
  profileActivities:[{
    activities:
    {
      type: String,
      required:true
    }
  }],
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }]

});

userSchema.methods.generateAuthToken = async function(){
  try {
    
    const token = jwt.sign({ _id: this._id}, process.env.SECRET_KEY);

    this.tokens = this.tokens.concat({token});

    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
}


userSchema.pre('save', async function (next) {
  if(this.isModified("password")){
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);;
  }
  next();
});


const storeUsers = new mongoose.model('users_shoestore', userSchema);

module.exports = storeUsers;
