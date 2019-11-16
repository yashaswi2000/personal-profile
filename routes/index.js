var express = require('express');
var router=express.Router();
const { User, validate } = require('../models/user');
const { Data, validatedata } = require('../models/profile');

router.get('/', async(req,res) => {
    datas = await Data.find({});
    res.render('home',{datas});
});

router.post('/', async(req,res) => {
    var name = req.body.password;
    datas = await Data.find({name: name});
    res.render('home',{datas});
});
module.exports = router;