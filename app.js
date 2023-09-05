const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const Spot = require('./models/spot')
const methodOverride = require('method-override')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')
const {spotSchema} = require('./schemas')

mongoose.connect('mongodb://127.0.0.1:27017/spotPedia')

const db = mongoose.connection
db.on('error', console.error.bind(console, "Connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

const validateSpot = (req, res, next) => {
    const {error} = spotSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/spots', catchAsync(async (req, res, next) => {
   const spots = await Spot.find({})
   res.render('spots/index', {spots})
}))

app.get('/spots/new', (req, res) => {
    res.render('spots/new')
})

app.post('/spots', validateSpot, catchAsync(async (req, res, next) => {
    const spot = new Spot(req.body.spot)
    await spot.save()
    res.redirect(`/spots/${spot._id}`)
}))

app.get('/spots/:id', catchAsync(async (req, res, next) => {
    const spot = await Spot.findById(req.params.id)
    res.render('spots/show', {spot})
}))

app.get('/spots/:id/edit', catchAsync(async (req, res, next) => {
    const spot = await Spot.findById(req.params.id)
    res.render('spots/edit', {spot})
}))

app.put('/spots/:id', validateSpot, catchAsync(async (req, res, next) => {
    const spot = await Spot.findByIdAndUpdate(req.params.id, {...req.body.spot})
    res.redirect(`/spots/${spot._id}`)
}))

app.delete('/spots/:id', catchAsync(async (req, res, next) => {
    await Spot.findByIdAndDelete(req.params.id)
    res.redirect('/spots')
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
