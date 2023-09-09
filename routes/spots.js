const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Spot = require('../models/spot')
const {isLoggedIn, isAuthor, validateSpot} = require('../middleware')

router.get('/', catchAsync(async (req, res, next) => {
    const spots = await Spot.find({})
    res.render('spots/index', {spots})
 }))
 
router.get('/new', isLoggedIn, (req, res) => {
    res.render('spots/new')
})
 
 router.post('/', isLoggedIn, validateSpot, catchAsync(async (req, res, next) => {
    const spot = new Spot(req.body.spot)
    spot.author = req.user._id
    await spot.save()
    req.flash('success', 'Sucessfully made a new travel spots!')
    res.redirect(`/spots/${spot._id}`)
 }))
 
 router.get('/:id', catchAsync(async (req, res, next) => {
    const spot = await Spot.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!spot) {
        req.flash('error', 'Sorry, cannot find that travel spots!')
        return res.redirect('/spots')
    }
    res.render('spots/show', {spot})
 }))
 
 router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params
    const spot = await Spot.findById(id) 
    if (!spot) {
        req.flash('error', 'Sorry, cannot find that travel spots!')
        return res.redirect('/spots')
    }
    res.render('spots/edit', {spot})
 }))
 
 router.put('/:id', isLoggedIn, isAuthor, validateSpot, catchAsync(async (req, res, next) => {
    const {id} = req.params
    const spot = await Spot.findByIdAndUpdate(id, {...req.body.spot})
    req.flash('success', 'Successfully update travel spots!')
    res.redirect(`/spots/${spot._id}`)
 }))
 
 router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
     await Spot.findByIdAndDelete(req.params.id)
     req.flash('success', 'Successfully deleted travel spots!')
     res.redirect('/spots')
 }))

 module.exports = router