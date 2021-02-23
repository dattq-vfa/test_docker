const express = require('express');
const router = express.Router();

var fs = require('fs');
const BannerModel = require('../models/banner_models');
const multer = require('multer');
let path='';
let link_banner ='';
const storage = multer.diskStorage({
    //duong dan luu file
    destination: (req,file,cb)=>{
        cb(null,'public/uploads/uploads');
    },
    //kiem tra file
    filename: (req,file,cb)=>{
        if(file.mimetype != 'image/jpeg'&&file.mimetype != 'image/png')
        {
            return cb('File khong dung dinh dang');
        }
        else
        {
            let path_img ='Banner' + '-' + Date.now() + '-' + file.originalname;
            cb(null, path_img);
            path = 'ok';
            link_banner = path_img;
        }
    }
});

var limits = {fileSize: 1024*5000}; 

var upload = multer({storage: storage, limits: limits });

var link = {home:'',category:'',user:'', banner:''};
router.get('/banner',(req,res)=>{
    main = 'Slide_managerment/slide_banner';
    link.banner = 'active';
    BannerModel.find()
    .sort({stt: 1}) 
    .exec((err,data)=>{
        if(err)
        {
            res.send({kq: 0, err: err})
        }
        else
        {
            str ='';
            data.forEach((v)=>{
                str +=  `<tr id="`+v._id+`">
                            <td>`+v.stt+`</td>
                            <td><img src="/public/uploads/uploads/`+v.img+`" alt="`+v.img+`"></td>
                            <td>`+v.status+`</td>
                            <td>
                                <button class="btn btn-info btn-adjust edit_banner"><span style="display:none;">`+JSON.stringify(v)+`</span><i class="fas fa-pencil-alt""></i></button>
                                <button type="button" class="btn btn-danger btn-adjust delete_banner"><span style="display:none;">`+JSON.stringify(v)+`</span><i class="fas fa-trash-alt"></i></button>
                            </td>
                        </tr>`
            });
            res.render('index', {main: main, str:str,link: link});
        }
    });

});

router.post('/Add_Banner',(req,res)=>{
    upload.any()(req, res, function(err){
        if(path=='') 
        {
            res.send('No choosed Image');
        }
        else if(err instanceof multer.MulterError)
        {
            (err.field == "img") ? res.send("File Avatar quá lớn"): res.send("File Items quá lớn");
        }
        else if(err) 
        {
            res.send(err);
        }
        else
        {
            obj = [
                {
                    img: link_banner,
                    stt: req.body.No,
                    status: req.body.status,
                }
            ];
            BannerModel.create(obj,(err,data_token)=>{
                if(err)
                {
                    res.send('err add banner');
                }
                else
                {
                    link_banner=''
                    res.send("ok");
                }
            });
        }
        path ='';
    });

});

router.post('/Edit_Banner',(req,res)=>{
    upload.any()(req, res, function(err){
        let img_banner = req.body.name_banner;
        if(err instanceof multer.MulterError)
        {
            (err.field == "img") ? res.send("File Avatar quá lớn"): res.send("File Items quá lớn");
        }
        else if(err) 
        {
            res.send(err);
        }
        else
        {
            (link_banner!="") ? name_banner = link_banner : name_banner = img_banner;
            obj =
                {
                    stt: req.body.No,
                    status: req.body.status,
                    img: name_banner,
                }
            BannerModel.updateMany({ _id: req.body.id },obj,(err,data)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    // delete_img(data_img,'item');
                    if(link_banner!="") {delete_img(img_banner);}
                    name_banner=''; link_banner='';
                    res.send('Completed!')
                }
            });
        }
        path ='';
    });

});


router.post('/delete_banner',(req,res)=>{
    let data_delete = JSON.parse(req.body.database_banner);
    console.log(data_delete);
    BannerModel.findByIdAndDelete({ _id: data_delete._id},(err,data)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            delete_img(data_delete.img);
            data_delete =[];
            res.send('da xoa');
        }
    });
});

module.exports = router; 

function delete_img(data){
    if (fs.existsSync('./public/uploads/uploads/'+ data))
    {
        fs.unlink('./public/uploads/uploads/'+ data, function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });
    }
}