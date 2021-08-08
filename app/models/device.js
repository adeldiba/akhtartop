const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const deviceSchema = Schema({
    name : { type : String , required : true},
    slug : { type : String , required : true},
    lang : { type : String , required : true},
    parent : { type : Schema.Types.ObjectId , ref : 'Device' , default : null },
} , { timestamps : true , toJSON : { virtuals : true } });

deviceSchema.plugin(mongoosePaginate);

deviceSchema.virtual('childs' , {
    ref : 'Device',
    localField : '_id',
    foreignField : 'parent'
});


module.exports = mongoose.model('Device' , deviceSchema);