var express = require('Express');
var router = express.Router();
var apartmentsController = require('../controllers/apartmentsController');

router.get('/',

    function(req, res, next){
        res.locals.admin = false;
        next();
    }, apartmentsController.GetAllApartments);

router.post('/', apartmentsController.GetAllApartments);

router.post('/admin',
    function(req, res, next){
    res.locals.admin = true;
    next();
}, apartmentsController.GetAllApartments);

router.get('/admin',

    function(req, res, next){
        res.locals.admin = true;
        next();
    }, apartmentsController.GetAllApartments);



router.get('/apartment/add-new', (req,res) => {
    res.render('add-apartment.ejs');
});

router.post('/apartment/add-new', apartmentsController.AddApartment);

router.get('/apartment/:id', apartmentsController.GetApartment);

router.post('/apartment/:id', apartmentsController.ReserveApartment);

router.get('/admin/apartment/:id/edit', apartmentsController.EditApartmentGET);

router.post('/admin/apartment/:id/edit', apartmentsController.EditApartmentPOST);

router.get('/admin/apartment/:id/hide', apartmentsController.HideApartment);

router.get('/admin/unhideall', apartmentsController.UnhideAll);

module.exports = router;