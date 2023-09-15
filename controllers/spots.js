const Spot = require('../models/spot')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res, next) => {
    const spots = await Spot.find({})
    res.render('spots/index', {spots})
 }

 module.exports.renderNewForm = (req, res) => {
    res.render('spots/new')
}

module.exports.createSpots = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.spot.location,
        limit: 1
    }).send()
    const spot = new Spot(req.body.spot)
    spot.geometry = geoData.body.features[0].geometry
    spot.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    spot.author = req.user._id
    await spot.save()
    // console.log(spot)
    req.flash('success', 'Sucessfully made a new travel spots!')
    res.redirect(`/spots/${spot._id}`)
 }

 module.exports.showSpots = async (req, res, next) => {
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
 }

 module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params
    const spot = await Spot.findById(id) 
    if (!spot) {
        req.flash('error', 'Sorry, cannot find that travel spots!')
        return res.redirect('/spots')
    }
    res.render('spots/edit', {spot})
 }

 module.exports.updateSpots = async (req, res, next) => {
    const {id} = req.params
    const spot = await Spot.findByIdAndUpdate(id, {...req.body.spot})
    imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    spot.images.push(...imgs)
    await spot.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await spot.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully update travel spots!')
    res.redirect(`/spots/${spot._id}`)
 }

 module.exports.deleteSpots = async (req, res, next) => {
    await Spot.findByIdAndDelete(req.params.id)
    req.flash('success', 'Successfully deleted travel spots!')
    res.redirect('/spots')
}