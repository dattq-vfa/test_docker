const express = require('express');
const router = express.Router();

router.get('/contact',(req,res)=>{
    main = 'contacts/contact';
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

module.exports = router; //xuat ra du lieu de su dung