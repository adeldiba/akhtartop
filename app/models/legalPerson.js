const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const legalPersonSchema = Schema({
    user : [{ type : Schema.Types.ObjectId , ref : 'User'}],
    company_name : { type : String, requred: true },
    company_type : { type : String, requred: true },
    register_number : { type : String, requred: true },
    national_ID : { type : String, requred: true },
    economic_code : { type : String, requred: true },
    holders_sign : { type : String, requred: true },
    phoneP : { type : String, requred: true },
    telphoneP: { type : String, requred: true },
    store_name: { type : String , requred: true },
    locationP: { type : String , requred: true },
    stateP : { type : String , requred: true },
    cityP : { type : String , requred: true },
    addressP : { type : String, required : true  },
    postal_codeP : { type : String , required : true},
    kala : { type : String , required : true},
    Shaba_number: { type : String , required : true},
    variety: { type : String , required : true}
} , { timestamps : true, toJSON : { virtuals : true } });

legalPersonSchema.plugin(mongoosePaginate); 


module.exports = mongoose.model('LegalPerson' , legalPersonSchema);