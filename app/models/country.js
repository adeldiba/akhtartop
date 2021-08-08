const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const countrySchema = Schema({
    name : { type : String , required : true},
    slug : { type : String , required : true},
    lang : { type : String , required : true},
    parent : { type : Schema.Types.ObjectId , ref : 'Country' , default : null },
} , { timestamps : true , toJSON : { virtuals : true } });

countrySchema.plugin(mongoosePaginate);

countrySchema.virtual('childs' , {
    ref : 'Country',
    localField : '_id',
    foreignField : 'parent'
});

module.exports = mongoose.model('Country' , countrySchema);