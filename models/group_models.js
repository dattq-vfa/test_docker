const mongoose = require('mongoose');

const Schema = mongoose.Schema;

 const GroupSchema = new Schema({
   Group :{
        type: String,
        unique: true
    },
   id_user: mongoose.Schema.Types.ObjectId,
 });

module.exports = mongoose.model('group', GroupSchema);


