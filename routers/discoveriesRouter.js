require('dotenv').config();
const User = require('../schemas/userSchema')
const Discovery = require('../schemas/discoverySchema')
const FormData = require('form-data');
const fetch = require('node-fetch')

const router = require('express').Router()

router.get('/', async (req,res) => {
    const discoveries = await Discovery.find()
    res.render('discoveries', {user:req.user, discoveries})
})

router.post('/uploadAvatar', async (req,res) => {
    const {base64Image} = req.body
    const url = 'https://api.imgur.com/3/image';
    const formData = new FormData();
    formData.append('image', base64Image);      
    const options = {
            method: 'POST',
            headers: {
                Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            },
            body: formData
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result)
        const data = result.data;

        await User.findOneAndUpdate({_id:req.user._id}, {$set: {avatar:data.link}})
        
    } catch (error) {
        console.error('Error uploading image:', error);
    }
    res.redirect('/discoveries')
})


router.post('/addDiscovery', async (req,res) => {
    const {title, description, important} = req.body
    console.log(important)
    console.log(req.user)
    let avatar = req.user.avatar
    if (!req.user.avatar) {
        avatar = '/avatar.png'
    }
    const newDiscovery = new Discovery({
        userId: req.user._id,
        title,
        description,
        important: important == "true",
        author: req.user.fname + ' ' + req.user.lname,
        role: req.user.role,
        avatar: avatar
    })
    await newDiscovery.save()
    res.redirect('/discoveries')
})

router.get('/:id', async (req,res) => {
    try {
        const discovery = await Discovery.findOne({_id:req.params.id})
        res.render('discovery', {user:req.user, discovery})       
    } catch (error) {
        console.log(error)
        res.send('something went wrong. please try again.')
    }
})

router.post('/delete', async (req,res) => {
    await Discovery.deleteOne({_id:req.body.id})
    console.log('hava me udd gya')
    return res.json({message:'Deleted', success: true})
})

module.exports = router