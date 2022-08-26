var fs = require('fs');
var path = require('path');
const Apartment = require('../models/apartment');


const GetAllApartments = async (req, res) => {

    var query = {};

    query.hidden = false;

    if (req.body.personAmount)
    {
        query.rooms = { $gte: req.body.personAmount };
    }

    if (req.body.price)
    {
        query.price = { $gte: req.body.price };
    }

    if (req.body.city)
    {
        query.city = req.body.city
    }

    let apartments = await Apartment.find(query);

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

    let utilities = checkboxChecker(req.body.util_ac, req.body.util_heater, req.body.util_accessibility, req.body.util_tv, req.body.util_kitchen, req.body.util_internet);

    let images = GetIMGs(req.body.mainImg, req.body.img1, req.body.img2, req.body.img3, req.body.img4);

    let apartment = new Apartment
    ({
        privateID: tempId,
        title: req.body.title,
        description: req.body.description,
        rules: req.body.rules,
        mainImg: images.mainimg,
        img1: images.images[0],
        img2: images.images[1],
        img3: images.images[2],
        origImg1: images.imagesOriginal[0],
        origImg2: images.imagesOriginal[1],
        origImg3: images.imagesOriginal[2],
        origImg4: images.imagesOriginal[3],
        rooms: req.body.rooms,
        roomsBeds: req.body.roomsBeds,
        bathrooms: req.body.bathrooms,
        price: req.body.price,
        size: req.body.size,
        city: req.body.city,
        utilities: {
            ac: utilities.ac,
            heater: utilities.heater,
            accessibility: utilities.accessibility,
            tv: utilities.tv,
            kitchen: utilities.kitchen,
            internet: utilities.internet
        },
        hidden: false
    });
    apartment.save();
    res.redirect('/');
};

const EditApartmentGET = async (req, res) => {
    let apartment = await Apartment.findOne({privateID: req.params.id});
    res.render('edit-apartment', {
        apartment
    })
};

const EditApartmentPOST = async (req, res) => {
    
    let apartment = await Apartment.findOne({privateID: req.params.id})


    let utilities = checkboxChecker(req.body.util_ac, req.body.util_heater, req.body.util_accessibility, req.body.util_tv, req.body.util_kitchen, req.body.util_internet);

    let images = GetIMGs(req.body.mainImg, req.body.img1, req.body.img2, req.body.img3, req.body.img4);


    await apartment.updateOne
    ({
        privateID: req.body.tempId,
        title: req.body.title,
        description: req.body.description,
        rules: req.body.rules,
        mainImg: images.mainimg,
        img1: images.images[0],
        img2: images.images[1],
        img3: images.images[2],
        origImg1: images.imagesOriginal[0],
        origImg2: images.imagesOriginal[1],
        origImg3: images.imagesOriginal[2],
        origImg4: images.imagesOriginal[3],
        rooms: req.body.rooms,
        roomsBeds: req.body.roomsBeds,
        bathrooms: req.body.bathrooms,
        price: req.body.price,
        size: req.body.size,
        city: req.body.city,
        utilities: {
            ac: utilities.ac,
            heater: utilities.heater,
            accessibility: utilities.accessibility,
            tv: utilities.tv,
            kitchen: utilities.kitchen,
            internet: utilities.internet
        }
    });
    apartment.save();
    res.redirect('/admin');
}

const HideApartment = async (req, res) => {
    let apartment = await Apartment.findOne({privateID: req.params.id});
    await apartment.updateOne({$set: {hidden: true}});
    await apartment.save();
    res.redirect('/admin');
}

const UnhideAll = async (req, res) => {
    let apartments = await Apartment.find({hidden: true});

    for (const app of apartments) {
        await app.updateOne({$set: {hidden: false}});
        app.save();
    }
    res.redirect('/admin');
}


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

        

        res.render('view-apartment', {
            apartment,
            rented: 1
        });

    } else {
        res.render('view-apartment', {
            apartment,
            rented: 2
        });
    
    }


};


function checkboxChecker(ac, heater, accessibility, tv, kitchen, internet) {
    if (ac != 'false'){
        ac = true;
    }
    if (heater != 'false'){
        heater = true;
    }
    if (accessibility != 'false'){
        accessibility = true;
    }
    if (tv != 'false'){
        tv = true;
    }
    if (kitchen != 'false'){
        kitchen = true;
    }
    if (internet != 'false'){
        internet = true;
    }
    return { ac, heater, accessibility, tv, kitchen, internet};
}

function GetIMGs(mainimg, img1, img2, img3, img4) {

    switch (mainimg)
    {
        case 'img1':
            mainimg = img1;
        break;
        case 'img2':
            mainimg = img2;
        break;
        case 'img3':
            mainimg = img3;
        break;
        case 'img4':
            mainimg = img4;
        break;
    }

    let imagesOriginal = [img1, img2, img3, img4];

    let images = new Array(...imagesOriginal);

    for (let i = 0; i < 4; i++) {
        if (images[i] == mainimg)
        {
            images.splice(images.indexOf(images[i]), 1);
        }
    }

    return { imagesOriginal, images, mainimg }
}

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
    EditApartmentGET,
    EditApartmentPOST,
    HideApartment,
    UnhideAll
}