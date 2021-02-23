const express = require('express');
const router = express.Router();

//load bcrypt 
const bcrypt = require('bcrypt');
//goi model
const UserModel = require('../models/user_models');
const TokenModel = require('../models/token_models');

//goi jwt
const jwt = require('jsonwebtoken');
//goi localstorage
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./cratch');

var link = {home:'',category:'',user:'', banner:''};

router.get('/login',(req,res)=>{
    main = 'users/login';
    link.home = 'active';
    res.render('index',{main:main, link:link});//gui du lieu khi su dung ejs
});

router.get('/sign_up',(req,res)=>{
    main = 'users/sign_up_user';
    link.home = 'active';
    res.render('index',{main:main, link:link});//gui du lieu khi su dung ejs
});

router.get('/forgot_password',(req,res)=>{
    main = 'users/forgot_password';
    link.home = 'active';
    res.render('index',{main:main, link:link});//gui du lieu khi su dung ejs
});

router.post('/signup_user',(req,res)=>{
    let check=0;
    let err='';
    let name = (req.body.name).toUpperCase();
    let username = (req.body.username).replace(/\s+/g, ''); // \slà biểu thức chính cho "khoảng trắng" và glà cờ "toàn cầu", nghĩa là khớp với TẤT CẢ \s(khoảng trắng).
    let password = req.body.password;
    let email = req.body.email; 
    let phone = req.body.phone;
    let address = req.body.address; 

    pattern_name = /^([a-zA-Z\sàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ]){1,30}$/
    subject_name = name;
    pattern_username = /^([a-z]|[A-Z]){1,20}$/
    subject_username = username;
    pattern_pass = /^(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[0-9a-zA-Z!@#$%^&*.]{8,}$/ //?=.*[a-z] giống if sau đó thực hiện [0-9a-zA-Z!@#$%^&*.]{8,}
    subject_pass = password;
    pattern_phone = /^0(3[2-9]|56|58|59|70|7[6-9]|8[1-6]|8[8-9]|)[0-9]{7}$/ //3[2-9] thay cho 32-39
    subject_phone = phone;
    pattern_email = /^([a-z,A-Z,0-9]){3,}\@gmail.(com|co)$/
    subject_email = email;
    (pattern_name.test(subject_name)) ? check=check+1: err+='Please enter name again!'+'\n';
    (pattern_username.test(subject_username)) ? check=check+1: err+='Please enter username again!'+'\n';
    (pattern_pass.test(subject_pass)) ? check=check+1: err+='Please enter password again!'+'\n';
    (pattern_phone.test(subject_phone)) ? check=check+1: err+='Please enter phone again!'+'\n';
    (pattern_email.test(subject_email)) ? check=check+1: err+='Please enter email again!';

    if(check==5)
    {
        const saltRounds= 10; //độ mã hóa
        //1. tạo chuỗi hash
        bcrypt.genSalt(saltRounds,(err, salt)=>{
            bcrypt.hash(password, salt,(err,hash)=>{
                object = [
                    {
                        name: name,
                        username: username,
                        password: hash,
                        email: email,
                        phone: phone,
                        address: address,
                        Role: [1,2],
                    }
                ]
                UserModel.create(object,(err,data)=>{
                    if(err)
                    {
                        console.log(err);
                        res.send('err');
                    }
                    else
                    {
                        console.log(data);
                        res.send('ok')
                    }
                });
            });
        });
    }
    else
    {
        res.send(err);
        err=''
        check=0;
    }
});

router.post('/Login_user',(req,res)=>{
    UserModel.find({username: {'$regex': req.body.username} })
    .exec((err,data)=>{
            if(err)
            {
                res.send(err);
            }
            else
            {
                if(data.length<1)
                {
                    res.send('Tên không tồn tại!');
                }
                else
                {
                    check_pass = bcrypt.compareSync(req.body.password, data[0].password);
                    if(check_pass)
                    {
                        payload = {
                                    name: data[0].name,
                                    username: data[0].username,
                                    password: data[0].password,
                                    email: data[0].email,
                                    phone: data[0].phone,
                                    address: data[0].address,
                                    Role: data[0].Role,
                                    status: data[0].status
                                }
                        serectKey = '@#$%';
                        token = jwt.sign(payload,serectKey, {expiresIn: 30}); //expiresIn: 120 la thoi gian 120s
                            obj = [
                                {
                                    id_user: data[0]._id,
                                    token: token
                                }
                            ]
                        TokenModel.create(obj,(err,data_token)=>{
                            if(err)
                            {
                                res.send('err create token');
                            }
                            else
                            {
                                localStorage.setItem('token',token);
                                localStorage.setItem('account',(data[0].name).toUpperCase());
                                localStorage.setItem('id_user',data[0]._id);
                                res.send('ok');
                            }
                        });
                    } 
                    else
                    {
                        res.send('sai mat khau');
                    }
                }           
            }
    });
});

router.get('/logout',(req,res)=>{
    localStorage.removeItem('token');
    localStorage.removeItem('account');
    localStorage.removeItem('id_user');
    main = 'partials/main_home';
    link.home = 'active';
    res.render('index',{main:main, link: link});//gui du lieu khi su dung ejs
});

module.exports = router; //xuat ra du lieu de su dung