const express = require('express');
const router = express.Router();

//load bcrypt 
const bcrypt = require('bcrypt');
//goi model
const UserModel = require('../models/user_models');

//goi jwt
const jwt = require('jsonwebtoken');
//goi localstorage
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./cratch');

var link = {home:'',category:'',user:'', banner:''};

router.get('/user',(req,res)=>{
    main = 'users/list_user';
    link.user = 'active';
    UserModel.find({status: false})
    .exec((err,data)=>{
        if(err)
        {
            res.send({kq: 0, err: err})
        }
        else
        {
            str ='';
                data.forEach((v)=>{
                    str += `<tr id="`+v._id+`">
                                <td>`+v.name+`</td>
                                <td>`+v.username+`</td>
                                <td>`+v.email+`</td>
                                <td>`+v.phone+`</td>
                                <td>`+v.address+`</td>
                                <td>`+v.Role+`</td>
                                <td>`+v.status+`</td>
                                <td>
                                    <button class="btn btn-info btn-adjust edit_user"><span style="display:none;">`+JSON.stringify(v)+`</span><i class="fas fa-pencil-alt"></i></button>
                                    <button type="button" class="btn btn-danger btn-adjust delete_user_tmp"><span style="display:none;">`+JSON.stringify(v)+`</span><i class="fas fa-trash-alt"></i></button>
                                </td>
                            </tr>`
                });
            
            res.render('index', {main: main, str:str,link: link});
        }
    });
});

router.post('/Add_user',(req,res)=>{

    let check=0;
    let err='';
    let name = (req.body.name).toUpperCase();
    let username = (req.body.username).replace(/\s+/g, ''); // \slà biểu thức chính cho "khoảng trắng" và glà cờ "toàn cầu", nghĩa là khớp với TẤT CẢ \s(khoảng trắng).
    let password = req.body.password;
    let email = req.body.email; 
    let phone = req.body.phone;
    let address = req.body.address; 
    let Role = req.body.role;
    let status = req.body.status;

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
                        Role: Role,
                        status: status,
                    }
                ]
                UserModel.create(object,(err,data)=>{
                    (err) ? res.send('err add user'):res.send('ok');
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

router.post('/edit_user',(req,res)=>{
    let check=0;
    let tmp='';
    let check_pass='';
    let name = (req.body.name).toUpperCase();
    let username = (req.body.username).replace(/\s+/g, ''); // \slà biểu thức chính cho "khoảng trắng" và glà cờ "toàn cầu", nghĩa là khớp với TẤT CẢ \s(khoảng trắng).
    let password = req.body.password;
    let email = req.body.email; 
    let phone = req.body.phone;
    let address = req.body.address; 
    let Role = req.body.role;
    let status = req.body.status;

    pattern_name = /^([a-zA-Z\sàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ]){1,30}$/
    subject_name = name;
    pattern_username = /^([a-z]|[A-Z]){1,20}$/
    subject_username = username;
    pattern_phone = /^0(3[2-9]|56|58|59|70|7[6-9]|8[1-6]|8[8-9]|)[0-9]{7}$/ //3[2-9] thay cho 32-39
    subject_phone = phone;
    pattern_email = /^([a-z,A-Z,0-9]){3,}\@gmail.(com|co)$/
    subject_email = email;
    (pattern_name.test(subject_name)) ? check=check+1: tmp+='Please enter name again!'+'\n';
    (pattern_username.test(subject_username)) ? check=check+1: tmp+='Please enter username again!'+'\n';
    (pattern_phone.test(subject_phone)) ? check=check+1: tmp+='Please enter phone again!'+'\n';
    (pattern_email.test(subject_email)) ? check=check+1: tmp+='Please enter email again!';

    var check_data = new Promise((resolve,reject)=>{
        if(password!='')
        {
            pattern_pass = /^(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[0-9a-zA-Z!@#$%^&*.]{8,}$/ //?=.*[a-z] giống if sau đó thực hiện [0-9a-zA-Z!@#$%^&*.]{8,}
            subject_pass = password;
            (pattern_pass.test(subject_pass)) ? resolve('ok pass'):  reject('Please enter password again!');
        }
        else resolve('none pass');
    });

    check_data.then((result)=> {
        console.log(result + ' ' + check);
        if(check==4 && result=='ok pass')
        {
            const saltRounds= 10; //độ mã hóa
            //1. tạo chuỗi hash
            bcrypt.genSalt(saltRounds,(err, salt)=>{
                bcrypt.hash(password, salt,(err,hash)=>{
                    obj ={
                            name: name,
                            username: username,
                            password: hash,
                            email: email,
                            phone: phone,
                            address: address,
                            Role: Role,
                            status: status,
                        }
                    UserModel.updateMany({ _id: req.body.id },obj,(err,data)=>{
                        (err) ? res.send('err edit user'):res.send('ok');
                    });
                });
            });
        }
        else if(check==4 && result=='none pass')
        {
            obj ={
                    name: name,
                    username: username,
                    email: email,
                    phone: phone,
                    address: address,
                    Role: Role,
                    status: status,
                }
            UserModel.updateMany({ _id: req.body.id },obj,(err,data)=>{
                console.log(err);
                (err) ? res.send('err edit user'):res.send('ok');
            });
        }
        else
        {
            res.send(tmp);
            tmp='';
            check=0;
            check_pass=='';
        }
    })
    .catch((result)=> {
        res.send(result);
    });
});

router.post('/update_status_user',(req,res)=>{
    id = req.body.id;
    obj =  { status: true };
    UserModel.updateMany({ _id: id },obj,(err,data)=>{
        (err) ? res.send('err update_status'): res.send('da xoa');
    });
});

router.get('/user/register',(req,res)=>{
    main = 'users/register';
    link.user = 'active';
    res.render('index',{main:main, link:link});//gui du lieu khi su dung ejs
});

router.get('/list_delete_user',(req,res)=>{
    main = 'users/list_user';
    link.user = 'active';
    UserModel.find({status: true })
    .exec((err,data)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            str ='';
            data.forEach((v)=>{
                str += `<tr id="`+v._id+`">
                            <td>`+v.name+`</td>
                            <td>`+v.username+`</td>
                            <td>`+v.email+`</td>
                            <td>`+v.phone+`</td>
                            <td>`+v.address+`</td>
                            <td>`+v.Role+`</td>
                            <td>`+v.status+`</td>
                            <td>
                                <button class="btn btn-info btn-adjust restore_user"><span style="display:none;">`+JSON.stringify(v._id)+`</span>Restore</button>
                                <button type="button" class="btn btn-outline-danger btn-adjust list_delete_user"><span style="display:none;">`+JSON.stringify(v._id)+`</span>Delete</button>
                            </td>
                        </tr>`
            });
            res.render('index',{main:main,str:str, link: link});//gui du lieu khi su dung ejs
        }
    });
});

router.post('/delete_user',(req,res)=>{
    UserModel.findByIdAndDelete({ _id: req.body.id},(err,data)=>{
        (err) ? res.send('err delete_user'):res.send('da xoa');
    });
})

router.post('/restore_user',(req,res)=>{
    id = req.body.id;
    obj =  { status: false };
    UserModel.updateMany({ _id: id },obj,(err,data)=>{
        (err) ? res.send('err restore_user'):res.send('Done!');
    });
});


module.exports = router; //xuat ra du lieu de su dung