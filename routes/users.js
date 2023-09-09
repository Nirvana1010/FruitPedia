const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const { func } = require('joi')
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const {email, username, password} = req.body
        const user = new User({email, username})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome!!')
            res.redirect('/spots')
        })
    } catch(e) { 
        req.flash('error', e.message)
        res.redirect('register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/spots'
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) next (err)
        else {
            req.flash('success', 'Logged you out!')
            res.redirect('/spots')
        }
    })
})

module.exports = router