require('dotenv').config();
var express = require("Express");
var path = require("path");
var app = express();

var apartmentsRouter = require('./routes/apartmentsRouter.js');

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/@fortawesome/fontawesome-free')));
app.use('/', apartmentsRouter);

module.exports = app;