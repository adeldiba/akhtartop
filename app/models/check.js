const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const checkSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    parent : { type : Schema.Types.ObjectId , ref : 'Check' , default : null },
    approved : { type : Boolean , default : null },
    file : { type : String , required : true },
} , { timestamps : true , toJSON : {virtuals : true}});

checkSchema.plugin(mongoosePaginate);

checkSchema.methods.inc = async function(field , num = 1) {
    this[field] += num;
    await this.save();
} 

checkSchema.virtual('checks' , {
    ref : 'Check',
    localField : '_id',
    foreignField : 'parent'
});

module.exports = mongoose.model('Check' , checkSchema);