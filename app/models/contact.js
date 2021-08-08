const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const contactSchema = Schema({
    user : [{ type : Schema.Types.ObjectId , ref : 'User'}],
    name : { type : String, requred: true },
    email : { type : String, requred: true },
    phone: { type : String, requred: true },
    body : { type : String , requred: true  }
} , { timestamps : true, toJSON : { virtuals : true } });

contactSchema.plugin(mongoosePaginate); 

module.exports = mongoose.model('Contact' , contactSchema);