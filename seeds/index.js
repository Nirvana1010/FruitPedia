const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptions} = require('./seedHelpers')
const Spot = require('../models/spot')

mongoose.connect('mongodb://127.0.0.1:27017/spotPedia')

const db = mongoose.connection
db.on('error', console.error.bind(console, "Connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Spot.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const spot = new Spot({
            author: '64fc08ed08ec04a62cbbbde8',
            title: `${sample(descriptions)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor asperiores autem consequatur quod explicabo suscipit, fugit natus itaque animi ducimus ut iusto nihil omnis alias fugiat ad odio sit voluptatem?',
            price: price,
            geometry: { 
              type: 'Point', 
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
              ] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dfh2gktij/image/upload/v1694667347/SpotPedia/dmjookq9ldkkegcgqknc.jpg',
                  filename: 'SpotPedia/dmjookq9ldkkegcgqknc',
                },
                {
                  url: 'https://res.cloudinary.com/dfh2gktij/image/upload/v1694667396/SpotPedia/u0dgmn5qtfromebotnls.jpg',
                  filename: 'SpotPedia/u0dgmn5qtfromebotnls',
                },
                {
                  url: 'https://res.cloudinary.com/dfh2gktij/image/upload/v1694667452/SpotPedia/sjjucn2ic7r7hl0fpf5a.jpg',
                  filename: 'SpotPedia/sjjucn2ic7r7hl0fpf5a',
                }
              ]
        })
        await spot.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})