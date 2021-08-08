const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const episodeSchema = Schema({
    engine : { type : Schema.Types.ObjectId , ref : 'Engine'},
    discount : { type : String , required : true },
    notPrice : { type : String , required : true },
} , { timestamps : true , toJSON : {virtuals : true}});

episodeSchema.plugin(mongoosePaginate);

episodeSchema.virtual('engines' , {
    ref : 'Engine',
    localField : '_id',
    foreignField : 'episode'
})

module.exports = mongoose.model('Episode' , episodeSchema);