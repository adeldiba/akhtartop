const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const returnSchema = Schema({
    title : { type : String , required : true},
    slug : { type : String , required : true }, 
    lang : { type : String , required : true },
    body : { type : String, required : true},
    
} , { timestamps : true, toJSON : { virtuals : true }  });

returnSchema.plugin(mongoosePaginate); 

module.exports = mongoose.model('Return_p' , returnSchema); 