//goi mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://quangdattruong:Dat1@quang@cluster0.zdhkx.mongodb.net/SHOP_GIAY_ONLINE?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})// nho nhap pass va ten 
//thanh cong
.then(()=> console.log('thanh cong'))
//that bai bao loi
.catch((err)=>(console.log(err)));