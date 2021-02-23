const mongoose = require('mongoose');

const Schema = mongoose.Schema;

 const BannerSchema = new Schema({
        img: String,
        stt : String,
        status: {
            type: Boolean,
            default: false
        }
 });
 //tao collection
 module.exports = mongoose.model('banner', BannerSchema);


