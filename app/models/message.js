const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const messageSchema = Schema({
    title : { type : String , required : true},
    slug : { type : String , required : true }, 
    body : { type : String, required : true},  
} , { timestamps : true, toJSON : { virtuals : true }  });

messageSchema.plugin(mongoosePaginate); 

module.exports = mongoose.model('Message' , messageSchema); 