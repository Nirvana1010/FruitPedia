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
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const spot = new Spot({
            author: '64fc08ed08ec04a62cbbbde8',
            title: `${sample(descriptions)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor asperiores autem consequatur quod explicabo suscipit, fugit natus itaque animi ducimus ut iusto nihil omnis alias fugiat ad odio sit voluptatem?',
            price: price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dfh2gktij/image/upload/v1694311796/SpotPedia/bwohyyiecoyesa4mbvfz.png',
                  filename: 'SpotPedia/bwohyyiecoyesa4mbvfz',
                },
                {
                  url: 'https://res.cloudinary.com/dfh2gktij/image/upload/v1694311796/SpotPedia/g10cjlqgneh6aox9gyu0.png',
                  filename: 'SpotPedia/g10cjlqgneh6aox9gyu0',
                },
                {
                  url: 'https://res.cloudinary.com/dfh2gktij/image/upload/v1694311797/SpotPedia/nztlh29hik4t9zzoul53.png',
                  filename: 'SpotPedia/nztlh29hik4t9zzoul53',
                }
              ]
        })
        await spot.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})