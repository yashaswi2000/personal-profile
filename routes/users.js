const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User, validate } = require('../models/user');
const { Data, validatedata } = require('../models/profile');
//const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const url = require('url');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

var Storage = multer.diskStorage({
    destination:"./public/uploads/",
    filename: (req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
});

var upload = multer({
    storage:Storage
}).single('file');
 
router.get('/register',async(req,res) => {
    res.render('register');
    //console.log(req.body.name);
});

router.get('/login', async(req,res) => {
    res.render('login');
    console.log("gsjjzsvsvjfbv");
    //console.log(req.body.name);
});

router.get('/middle', async(req,res) => {
    //var name = req.session.
    let user = await User.findOne({email : req.session.username});
    if(req.session.type.compare("faculty"))
    {
        res.render('middleman',{name : user.name,email: user.email});
    }
    else
    {
        res.render('student',{name : user.name,email: user.email});
    }
    console.log("gsjjzsvsvjfbv");
    //console.log(req.body.name);
});



router.get('/view', async(req,res) => {
    //var name = req.session.
    let data = await Data.findOne({email : req.session.username});
    if(data == null)
    {
        res.render('modify',{name : '',email : '',department : '',phone : '',about : '',});
    }
    else{
    res.render('modify',{name : data.name,email : data.email,department : data.department,phone : data.phone,about : data.about});
    }
    console.log("gsjjzsvsvjfbv");
    //console.log(data.phone);
    //console.log(req.body.name);
});

router.get('/profile', async(req,res) => {

    //res.render('temp');
    const email1 = req.query;
        console.log(email1);
        let data1 = await Data.findOne(email1);
        res.render('logged',{name : data1.name,email : data1.email,department : data1.department,phone : data1.phone,image : data1.image});
    // let data = await Data.findOne({email : req.session.username});
    // if(data == null)
    // {

    // }
    // else{
    //     res.render('logged',{name : data.name,email : data.email,department : data.department,phone : data.phone,image : data.image});
    // }
})

router.get('/logout',async(req,res) => {

    req.session.destroy();
    //req.logout();
    res.redirect('/');
})

// router.get('/modify', async(req,res) => {
//     //var name = req.session.username;
//     //console.log(req.session.objectid);
//     //var id = mongoose.Types.ObjectId(req.session.objectid);
//     //console.log(typeof(id));
//     let data = await Data.find({email : req.session.username});
//     //if(!data) {
//     //    return res.status(400).send('no object.');
//     //}
//     console.log(data.phone);
//     res.render('modify',{name : data.name,email : data.email,department : data.department,phone : data.phone,about : data.about});
//     //console.log("gsjjzsvsvjfbv");
//     //console.log(req.body.name);
// });

router.post('/register', async (req, res) => {
    // First Validate The Request
    var name = req.body.name;
    console.log(name);

    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
 
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        req.session.loggedin = true;
        req.session.username = user.email;
        res.redirect('/users/middle');
    }
});
 



router.post('/login', async (req, res) => {
    // First Validate The HTTP Request
    var password = req.body.password;
    console.log(password);
    // const { error } = validate1(req.body);
    // if (error) {
    //     return res.status(400).send(error.details[0].message);
    // }
 
    //  Now find the user by their email address
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Incorrect email or password.');
    }
 
    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Incorrect email or password123.');
    }
    req.session.loggedin = true;
    req.session.username = user.email;
    req.session.type = req.body.type;
    res.redirect('/users/middle');
   // res.render('middleman',{username : user.name,email : user.email,});
    // res.redirect(url.format({
    //     pathname:"/loggedin",
    //     query: req.query,
    // }));
});



router.post('/view', upload, async(req,res) => {

    var image = req.file.filename;
    console.log(req.body.about);
    const { error } = validatedata(req.body);
    if (error) {
        console.log('error1');
        return res.status(400).send(error.details[0].message);
    }
    var newvalues = { $set: {name: req.body.name,email: req.body.email,department: req.body.department,phone: req.body.phone,about: req.body.about,image: req.file.filename} };
    let data = await Data.findOneAndUpdate({ email: req.session.username },newvalues);
    if (data) {
        console.log(data._id);
        req.session.objectid = data._id;
        console.log(req.body.email);
        // var myquery = { _id: mongoose.Types.ObjectId(data._id) };
        // var newvalues = { $set: req.body };
        // Data.updateOne(myquery,newvalues);
        var id = mongoose.Types.ObjectId(data._id);
      // data3 =  Data.findOne({_id : data._id});
       //console.log(data3.email);
       console.log(data);
        res.redirect('/users/middle');
       // return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
        data = new Data({
            name: req.body.name,
            email: req.body.email,
            department: req.body.department,
            phone: req.body.phone,
            about: req.body.about,
            image: req.file.filename
        });
        //const salt = await bcrypt.genSalt(10);
        //user.password = await bcrypt.hash(user.password, salt);
        await data.save();

        let data1 = await Data.findOne({email : req.session.username});
        console.log(data1.phone);
        req.session.objectid = data._id;
        console.log(typeof(data._id));
        res.redirect('/users/view');
    }

});


 
function validate1(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
 
    return Joi.validate(req, schema);
}

module.exports = router;