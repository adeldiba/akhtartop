const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const realPersonSchema = Schema({
    user : [{ type : Schema.Types.ObjectId , ref : 'User'}],
    nameP : { type : String, requred: true },
    nameP_family : { type : String, requred: true },
    phoneP : { type : String, requred: true },
    telphoneP: { type : String, requred: true },
    birth_yearP : { type : String , requred: true  },
    birth_dayP : { type : String, requred: true  },
    birth_monthP : { type : String , requred: true },
    certificateP: { type : String , requred: true },
    store_name: { type : String , requred: true },
    codeMP: { type : String , requred: true },
    men: { type : String , requred: true },
    woman: { type : String , requred: true },
    gendersP: { type : String , requred: true },
    locationP: { type : String , requred: true },
    stateP : { type : String , requred: true },
    cityP : { type : String , requred: true },
    addressP : { type : String, required : true  },
    postal_codeP : { type : String , required : true},
    kala : { type : String , required : true},
    Shaba_number: { type : String , required : true},
    variety: { type : String , required : true}
} , { timestamps : true, toJSON : { virtuals : true } });

realPersonSchema.plugin(mongoosePaginate); 


module.exports = mongoose.model('RealPerson' , realPersonSchema);