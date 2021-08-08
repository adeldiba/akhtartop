const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const addressSchema = Schema({
    user : [{ type : Schema.Types.ObjectId , ref : 'User'}],
    check:{type : Boolean , required : true}
} , { timestamps : true, toJSON : { virtuals : true } });

addressSchema.plugin(mongoosePaginate); 


module.exports = mongoose.model('Address' , addressSchema);