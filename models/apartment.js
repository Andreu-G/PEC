const mongoose = require('mongoose');
const { Schema } = mongoose;

const apartmentSchema = new Schema({
    privateID: Number,
    title: String,
    description: String,
    rules: String,
    mainImg: String,
    img1: String,
    img2: String,
    img3: String,
    origImg1: String,
    origImg2: String,
    origImg3: String,
    origImg4: String,
    rooms: Number,
    roomsBeds: Number,
    bathrooms: Number,
    price: Number,
    size: Number,
    utilities: [{
        ac: Boolean,
        heater: Boolean,
        accessibility: Boolean,
        tv: Boolean,
        kitchen: Boolean,
        internet: Boolean 
    }],
    dates: Array,
    available: Boolean
});

// Creamos el modelo: relacionamos el esquema apartmentSchema a la colección 'apartments'
const Apartment = mongoose.model("apartments", apartmentSchema);

module.exports = Apartment;