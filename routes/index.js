const express=require('express')
const router=express.Router()
const { ensureAuth, ensureGuest }=require('../middleware/auth')

const Story=require('../models/Story')

//@desc Login/Landing Page.
//@route GET/
router.get('/',ensureGuest,(req,res)=>{
    res.render('login',{layout:
        'layouts/loginLayout'})
})

// @desc Dashboard
//@route GET/dashboard
router.get('/dashboard',ensureAuth, async (req,res)=>{
    try{
       const stories=await Story.find({user:req.user.id}).lean() ;
       // lean converts stories from mongoose documents to plain js objects
       console.log(stories);
      
       res.render('dashboard',{
           name: req.user.firstName,
           stories:stories,
           helper:require('../helpers/ejshelper'),
       })
       
    }catch(err){
      console.log(err);
      res.render('error/500');
    }
    
})
// session is created to prevent being logged out if we change something on server side.
module.exports=router