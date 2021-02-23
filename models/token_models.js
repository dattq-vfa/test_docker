const mongoose = require('mongoose');

const Schema = mongoose.Schema;

 const Tokenchema = new Schema({
        id_user: mongoose.Schema.Types.ObjectId,
        token: String,
        status: {
            type: Boolean,
            default: true
        }
 });
 //tao collection
 module.exports = mongoose.model('token', Tokenchema);


