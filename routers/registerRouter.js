const router = require('express').Router()
const User = require('../schemas/userSchema')
const bcrypt = require('bcrypt')
const Researcher = require('../schemas/researcherSchema')
const Diver = require('../schemas/diverSchema')

router.get('/', (req, res) => {
    res.render('register', {error: ""})
})

router.post('/', async (req, res) => {
     const {email, password, fname, lname, role} = req.body
     const foundUser = await User.findOne({email})
     if (!email || !password || !fname || !lname) {
        return res.render('register', {error: "Please enter all the credentials."})
     }
     if (foundUser) {
        return res.render('register', {error: "A user with this username already exists. Please enter a unique username."})
     }
     const newUser = new User({
        email: email,
        fname: fname,
        lname: lname,
        role: role,
        password: await bcrypt.hash(password, 10)
      })
      await newUser.save()
      if (role === "researcher") {
          const newResearcher = new Researcher({
            userId: newUser._id
          })
          await newResearcher.save();
      } else {
         const newDiver = new Diver({
            userId: newUser._id
         })
         await newDiver.save();
      }
     return res.redirect('/login')
})

module.exports = router