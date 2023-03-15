require('dotenv').config()
const { urlencoded } = require('express');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
require("../db/conn");
const storeUsers = require('../models/shoeStoreUsers');
const port = process.env.PORT || 9200;
const bcrypt = require('bcryptjs');
const cookieParser = require("cookie-parser");
const auth = require("../middlewares/auth");
const validator = require('validator');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(urlencoded({extended:false}));

app.set("view engine","hbs");
app.set("views",path.join(__dirname, "../templates"));
hbs.registerPartials(path.join(__dirname, "../partials"));



app.get("/", (req,res) => {
    res.render('aboutMEhome');
})

app.get("/signin", (req,res) => {
    res.render('signin');
})

app.get("/login", (req,res) => {
  res.render('login');
})




app.get("/home", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/home"));
})

app.get('/signinPassing', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signinPassing"));
});

app.get('/editPassing', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/editPassing"));
});

app.get('/loginPassing', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/logininPassing"));
});

app.get('/logoutPassing', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/logoutPassing"));
});
  






app.post("/signinApiendpoint", async (req, res) => {
  try {
    const un = req.body.u;
    const e = req.body.e;
    const p = req.body.p;
    const pa = req.body.pa;
    const cpa = req.body.cpa;

    if (!un || !e || !p || !pa || !cpa) {
      return res.status(400).json({ allfieldsrequired: "All fields are required" });
    }

    if (!validator.isEmail(e)) {
      return res.status(400).json({ emailMsg: "Invalid email format" });
    }

    if (p.length !== 10) {
      return res.status(400).json({ phoneMsg: "Phone number must be 10 digits long" });
    }

    if (pa.length < 8) {
      return res.status(400).json({ passwordLength: "Password must be at least 8 characters long" });
    }

    if (pa !== cpa) {
      return res.status(400).json({ passwordNotMatch: "Password and confirm Password didn't match" });
    }

    const existingUser = await storeUsers.findOne({ email: e });
    const existingUserPhone = await storeUsers.findOne({ phonenumber: p });

    if (existingUserPhone) {
      return res.status(400).json({ phoneexists : "Phone Number already exist" });
    }

    if (existingUser) {
      return res.status(400).json({ exists : "Email already exists , Try New" });
    }


    const user = new storeUsers({
      username: un,
      email: e,
      phonenumber: p,
      password: pa,
      confirmpassword: cpa,
    });

    await user.save();

    res.status(201).json({ message: `Account created for ${req.body.e} successfully 😄 `});
  } catch (e) {
    res.status(500).json({ error: "failed" });
  }
});





app.post("/loginApiendpoint", async(req, res) => {
  try {
    const email = req.body.e;
    const password = req.body.pa;

    if (!email || !password ) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    const findCredentials = await storeUsers.findOne({ email });
    
    if (!findCredentials) {
      return res.json({ success: false, message: "Invalid email or password" });
    }
    
    const isMatch = await bcrypt.compare(password,findCredentials.password);
    
    if (isMatch) {
      const token = await findCredentials.generateAuthToken();
    
      res.cookie('jwt',token,{
        expires:new Date(Date.now() + 12000000000),
        httpOnly:true
        //secure:true
      });
      console.log("On login token generated is : "+token);
      
      res.json({ success: true, redirect: `/welcome` });

    } else {
      res.json({ success: false , message: "Invalid email or password" });
    }
    
  } catch(e) {
    console.log(e);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});





app.post('/logoutApiendpoint', auth, async (req, res) => {
  try {

    req.user.tokens = req.user.tokens.filter((currElem) => {
      return currElem.token != req.cookieToken; 
    })
    console.log(req.user.tokens);
    res.clearCookie('jwt');
    console.log('logged out successfully');

    const success =  await req.user.save();

    if(success){
      res.status(200).json({ 
        message: 'Logged out successfully',
        redirect : '/login' 
     });
    }
    
  } catch (e) {
    res.status(404).send();
  }
});

app.post('/logoutAllApiendpoint', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    res.clearCookie('jwt');
 
   
    await req.user.save();

    res.status(200).json({ 
      message: 'Logged out from all devices successfully',
      redirect : '/login' 
    });
  } catch (e) {
    res.redirect('/login');
  }
});


app.post('/editProApi', auth, async (req, res) => {
  try {
   
    await req.user.save();

    res.status(200).json({ 
      redirect : '/editProfile' 
    });

  } catch (e) {
    res.redirect('/login');
  }
});


app.get('/welcome', auth, async (req, res) => {
  try {
    const getDataUser = {
       userName : req.user.username,
       profileName : req.user.profileName,
       profileEmail : req.user.profileEmail,
       profileAddress : req.user.profileAddress,
       profileSkills : req.user.profileSkills,
       profileQualifications : req.user.profileQualifications,
       profileAchievement : req.user.profileAchievement,
       profileProjects : req.user.profileProjects,
       profileActivities : req.user.profileActivities,
    }
    
    console.log("Welcome cookie - " + req.cookies.jwt);
    
    if (req.cookies.jwt && !req.user.tokens.length 
    || !req.cookies.jwt && !req.user.tokens.length ) {
      console.log("cookie Present but not in db or not in browser too");
      res.redirect("/login");
    }
    if( req.cookies.jwt && req.user) {
      console.log("i am working");
      res.render('welcome', { getDataUser});
    }
  } catch (e) {
    res.redirect("/login");
  }
});


app.get("/editProfile", auth ,async (req,res) => {

  try {
    const dataProfile = {
      profileName : req.user.profileName,
      profileEmail : req.user.profileEmail,
      profileAddress : req.user.profileAddress,
      profileSkills : req.user.profileSkills,
      profileQualifications : req.user.profileQualifications,
      profileAchievement : req.user.profileAchievement,
      profileProjects : req.user.profileProjects,
      profileActivities : req.user.profileActivities,
   }
   
   res.render('editProfile',{dataProfile});
  await req.user.save();
  } catch (e) {
    res.redirect('/login');
  }

 
})



app.patch("/savedataApi", auth, async (req, res) => {

  try {
    const pName = req.body.pName;
    const pAddress = req.body.pAddress;
    const pEmail = req.body.pEmail;

    const dataProfile = {
      profileName: pName,
      profileEmail: pEmail,
      profileAddress: pAddress,
    };

    const updateData = await storeUsers.findByIdAndUpdate(req.user._id, dataProfile, { new: true });

    console.log(updateData);

    res.status(200).send({ message: "Profile updated successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error occurred while updating the profile." });
  }

});

app.post('/addSkillApi', auth, async (req, res) => {
  try {
    const inputVal = req.body.pgetSkill;
    console.log(inputVal);
    const user = await storeUsers.findOne({ _id: req.user._id }); 
    user.profileSkills.push({ skills: inputVal }); 
    await user.save();
    res.status(200).send({ message: "skill added successfully!" });
  } catch (e) {
    res.status(500).send({ message: "An error occurred while adding skill" });
  }
});


app.delete('/delprofileSkills/:id', auth, async (req, res) => {
  const itemId = req.params.id;
  console.log(itemId);
  try {
    const result = await storeUsers.findOneAndUpdate(
      { 'profileSkills._id': itemId },
      { $pull: { profileSkills: { _id: itemId } } },
      { new: true }
    );
    console.log(result);
    if (result !== null) {
      res.status(200).json({ message: 'Profile skill deleted' });
    } else {
      res.status(404).json({ message: 'Profile skill not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/QualificationApi', auth, async (req, res) => {
  try {
    const user = await storeUsers.findOne({ _id: req.user._id }); 
    const data1 =  req.body.quali;
    const data2 =  req.body.school;
    const data3 =  req.body.board;
    const data4 =  req.body.cgpa;
    const data5 =  req.body.year;
   

    const newQualification = {
      qualificationType: data1, 
      school: data2, 
      board: data3, 
      cgpa: data4, 
      year: data5, 
    };

    await user.profileQualifications.push(newQualification);
    await user.save();

    res.status(200).json(newQualification); 
  } catch (e) {
    res.status(500).send({ message: "An error occurred while adding Qualification" });
  }
});


app.delete('/QualificationApi/:id', auth, async (req, res) => {
  const itemId = req.params.id;
  console.log(itemId);
  try {
    const result = await storeUsers.findOneAndUpdate(
      { 'profileQualifications._id': itemId },
      { $pull: { profileQualifications: { _id: itemId } } },
      { new: true }
    );
    console.log(result);
    if (result !== null) {
      res.status(200).json({ message: 'Profile Qualification deleted' });
    } else {
      res.status(404).json({ message: 'Profile Qualification not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/AchievementApi', auth, async (req, res) => {
  try {
    const user = await storeUsers.findOne({ _id: req.user._id }); 
    const data1 =  req.body.inputAchievement;
   

    const newAchievement = {
      Achievement: data1, 
    };

    await user.profileAchievement.push(newAchievement);
    await user.save();

    res.status(200).json(newAchievement); 
  } catch (e) {
    res.status(500).send({ message: "An error occurred while adding Achievement" });
  }
});



app.delete('/AchievementApi/:id', auth, async (req, res) => {
  const itemId = req.params.id;
  console.log(itemId);
  try {
    const result = await storeUsers.findOneAndUpdate(
      { 'profileAchievement._id': itemId },
      { $pull: { profileAchievement: { _id: itemId } } },
      { new: true }
    );
    console.log(result);
    if (result !== null) {
      res.status(200).json({ message: 'Profile Achievement deleted' });
    } else {
      res.status(404).json({ message: 'Profile Achievement not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/ProjectsApi', auth, async (req, res) => {
  try {
    const user = await storeUsers.findOne({ _id: req.user._id }); 
    const data1 =  req.body.inputProjects;
   

    const newProjects = {
      projects: data1, 
    };

    await user.profileProjects.push(newProjects);
    await user.save();

    res.status(200).json(newProjects); 
  } catch (e) {
    res.status(500).send({ message: "An error occurred while adding Projects" });
  }
});



app.delete('/ProjectsApi/:id', auth, async (req, res) => {
  const itemId = req.params.id;
  console.log(itemId);
  try {
    const result = await storeUsers.findOneAndUpdate(
      { 'profileProjects._id': itemId },
      { $pull: { profileProjects: { _id: itemId } } },
      { new: true }
    );
    console.log(result);
    if (result !== null) {
      res.status(200).json({ message: 'Profile Projects deleted' });
    } else {
      res.status(404).json({ message: 'Profile Projects not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/ActivitiesApi', auth, async (req, res) => {
  try {
    const user = await storeUsers.findOne({ _id: req.user._id }); 
    const data1 =  req.body.inputActivities;
   

    const newActivities = {
      activities : data1, 
    };

    await user.profileActivities.push(newActivities);
    await user.save();

    res.status(200).json(newActivities); 
  } catch (e) {
    res.status(500).send({ message: "An error occurred while adding Activities" });
  }
});



app.delete('/ActivitiesApi/:id', auth, async (req, res) => {
  const itemId = req.params.id;
  console.log(itemId);
  try {
    const result = await storeUsers.findOneAndUpdate(
      { 'profileActivities._id': itemId },
      { $pull: { profileActivities: { _id: itemId } } },
      { new: true }
    );
    console.log(result);
    if (result !== null) {
      res.status(200).json({ message: 'Profile Activities deleted' });
    } else {
      res.status(404).json({ message: 'Profile Activities not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.listen(port, (req,res) => {
    console.log(`Working on ${port}`);
})
