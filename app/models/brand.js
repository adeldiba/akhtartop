const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const brandSchema = Schema({
    name : { type : String , required : true},
    slug : { type : String , required : true},
    lang : { type : String , required : true},
    parent : { type : Schema.Types.ObjectId , ref : 'Brand' , default : null },
} , { timestamps : true , toJSON : { virtuals : true } });

brandSchema.plugin(mongoosePaginate);

brandSchema.virtual('childs' , {
    ref : 'Brand',
    localField : '_id',
    foreignField : 'parent'
});

module.exports = mongoose.model('Brand' , brandSchema);