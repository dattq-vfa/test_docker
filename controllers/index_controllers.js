const express = require('express');
const router = express.Router();


const home_page_controllers = require('./home_page_controllers');
router.use('/',home_page_controllers);

const introduction_controllers = require('./introduction_controllers');
router.use('/',introduction_controllers);

const category_boy_controllers = require('./category_controllers');
router.use('/',category_boy_controllers);

const new_controllers = require('./new_controllers');
router.use('/',new_controllers);

const contact_controllers = require('./contact_controllers');
router.use('/',contact_controllers);

const user_controllers = require('./user_controllers');
router.use('/',user_controllers);

const login_controllers = require('./login_controllers');
router.use('/',login_controllers);

const banner_controllers = require('./banner_controllers');
router.use('/',banner_controllers);


module.exports = router; //xuat ra du lieu de su dung 