const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Spot = require('../models/spot')
const {spotSchema} = require('../schemas')

const validateSpot = (req, res, next) => {
    const {error} = spotSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.get('/', catchAsync(async (req, res, next) => {
    const spots = await Spot.find({})
    res.render('spots/index', {spots})
 }))
 
 router.get('/new', (req, res) => {
    res.render('spots/new')
 })
 
 router.post('/', validateSpot, catchAsync(async (req, res, next) => {
    const spot = new Spot(req.body.spot)
    await spot.save()
    req.flash('success', 'Sucessfully made a new travel spots!')
    res.redirect(`/spots/${spot._id}`)
 }))
 
 router.get('/:id', catchAsync(async (req, res, next) => {
     const spot = await Spot.findById(req.params.id).populate('reviews')
     if (!spot) {
         req.flash('error', 'Sorry, cannot find that travel spots!')
         return res.redirect('/spots')
     }
     res.render('spots/show', {spot})
 }))
 
 router.get('/:id/edit', catchAsync(async (req, res, next) => {
     const spot = await Spot.findById(req.params.id)
     if (!spot) {
        req.flash('error', 'Sorry, cannot find that travel spots!')
        return res.redirect('/spots')
    }
     res.render('spots/edit', {spot})
 }))
 
 router.put('/:id', validateSpot, catchAsync(async (req, res, next) => {
     const spot = await Spot.findByIdAndUpdate(req.params.id, {...req.body.spot})
     req.flash('success', 'Successfully update travel spots!')
     res.redirect(`/spots/${spot._id}`)
 }))
 
 router.delete('/:id', catchAsync(async (req, res, next) => {
     await Spot.findByIdAndDelete(req.params.id)
     req.flash('success', 'Successfully deleted travel spots!')

     res.redirect('/spots')
 }))

 module.exports = router