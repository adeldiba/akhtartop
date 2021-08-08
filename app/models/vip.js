const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const vipSchema = mongoose.Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    password : { type : String ,  required : true },
} , { timestamps : true, toJSON : {virtuals : true} });

vipSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Vip' , vipSchema);