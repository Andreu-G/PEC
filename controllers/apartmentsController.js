var fs = require('fs');
var path = require('path');
const Apartment = require('../models/apartment');


const GetAllApartments = async (req, res) => {
    let apartments = await Apartment.find();

    if (res.locals.admin)
    {
        res.render('index', {
            apartments,
            admin: true
        })
    } else {
        res.render('index', {
            apartments,
            admin: false
        })
    }

};

const GetApartment = async (req, res) => {

    let apartment = await Apartment.findOne({privateID: req.params.id});
    res.render('view-apartment', {
        apartment
    })
};

const AddApartment = (req, res) => {


    let tempId = GetID();

    //Checkbox "check"
    if (req.body.util_ac != 'false'){
        req.body.util_ac = true;
    }
    if (req.body.util_heater != 'false'){
        req.body.util_heater = true;
    }
    if (req.body.util_accessibility != 'false'){
        req.body.util_accessibility = true;
    }
    if (req.body.util_tv != 'false'){
        req.body.util_tv = true;
    }
    if (req.body.util_kitchen != 'false'){
        req.body.util_kitchen = true;
    }
    if (req.body.util_internet != 'false'){
        req.body.util_internet = true;
    }

    let mainImg;

    switch (req.body.mainImg)
    {
        case 'img1':
            mainImg = req.body.img1;
        break;
        case 'img2':
            mainImg = req.body.img2;
        break;
        case 'img3':
            mainImg = req.body.img3;
        break;
        case 'img4':
            mainImg = req.body.img4;
        break;
    }

    let imagesOriginal = [req.body.img1, req.body.img2, req.body.img3, req.body.img4];

    let images = [req.body.img1, req.body.img2, req.body.img3, req.body.img4];

    for (let i = 0; i < 4; i++) {
        if (images[i] == mainImg)
        {
            images.splice(images.indexOf(images[i]), 1);
        }
    }
    let apartment = new Apartment
    ({
        privateID: tempId,
        title: req.body.title,
        description: req.body.description,
        rules: req.body.rules,
        mainImg,
        img1: images[0],
        img2: images[1],
        img3: images[2],
        origImg1: imagesOriginal[0],
        origImg2: imagesOriginal[1],
        origImg3: imagesOriginal[2],
        origImg4: imagesOriginal[3],
        rooms: req.body.rooms,
        roomsBeds: req.body.roomsBeds,
        bathrooms: req.body.bathrooms,
        price: req.body.price,
        size: req.body.size,
        utilities: {
            ac: req.body.util_ac,
            heater: req.body.util_heater,
            accessibility: req.body.util_accessibility,
            tv: req.body.util_tv,
            kitchen: req.body.util_kitchen,
            internet: req.body.util_internet
        }
    });
    apartment.save();
    res.redirect('/');
};

const EditApartment = async (req, res) => {
    let apartment = await Apartment.findOne({privateID: req.params.id});
    console.log(apartment);
    res.render('edit-apartment', {
        apartment
    })
};

const ReserveApartment = async (req, res) => {
    let apartment = await Apartment.findOne({privateID: req.params.id});

    let bookedDates = apartment.dates;
    let checkInDate = new Date(req.body.CheckIn);
    let checkOutDate = new Date(req.body.CheckOut);
    let canBeRented = true;
    let bookingsToCheck = [];

 

    while(checkInDate <= checkOutDate)
    {
        bookingsToCheck.push(new Date(checkInDate));
        checkInDate.setDate(checkInDate.getDate() + 1);
    }

    bookingsToCheck.forEach((date) => {
        let result = bookedDates.find(d => d.toString() == date.toString());
        if (result) {
            canBeRented = false;
        }
    });

    if (canBeRented)
    {
        bookingsToCheck.forEach((date) => {
            bookedDates.push(date);
        })
        apartment.$set('dates', bookedDates);
        apartment.save();
        res.render('add-apartment');

    } else {
        let apartments = await Apartment.find();
        res.render('index', {
            apartments
        })
    
    }


};


function GetID(){
    let file = fs.readFileSync(path.resolve(__dirname, '../database/IDList.json'));
    let result = JSON.parse(file);
    let id = result.currentID;
    let data = {
        currentID: result.currentID + 1,
    }
    fs.writeFileSync(path.resolve(__dirname, '../database/IDList.json'), JSON.stringify(data));
    return id;
};

module.exports = {
    GetAllApartments,
    GetApartment,
    AddApartment,
    ReserveApartment,
    EditApartment
}