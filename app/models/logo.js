const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const logoSchema = Schema({
    email : { type : String , required : true },
    phone : { type : String , required : true },
    address : { type : String , required : true },
    body : { type : String , required : true },
    file : { type : String },
} , { timestamps : true , toJSON : {virtuals : true}});

logoSchema.plugin(mongoosePaginate);

logoSchema.methods.inc = async function(field , num = 1) {
    this[field] += num;
    await this.save();
} 

module.exports = mongoose.model('Logo' , logoSchema);