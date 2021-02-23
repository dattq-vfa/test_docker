const mongoose = require('mongoose');

const Schema = mongoose.Schema;

 const UserSchema = new Schema({
        name: String,
        username: {
            type: String,
            unique: true //primarykey
        },
        password: String,
        email: {
            type: String,
            unique: true
        },
        phone: {
            type: String,
            unique: true
        },
        address: String,
        Role: Array,
        status: {
            type: Boolean,
            default: false
        }
 });
 //tao collection
 module.exports = mongoose.model('user', UserSchema);


