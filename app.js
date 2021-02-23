const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public',express.static('public')); //khai báo public file kèm tên file public, nhớ thêm đưuòng dẫn /public/style.css bên index.ejs
app.use('/uploads/uploads',express.static(__dirname + 'public/uploads/uploads'));
app.set('view engine', 'ejs');
const jwt = require('jsonwebtoken');

//open api
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
//goi database
require('./database');

const index_controllers = require('./controllers/index_controllers.js');
app.use('/',index_controllers);


app.listen(process.env.PORT||3000,()=>{console.log('on server')})