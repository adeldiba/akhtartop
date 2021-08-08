const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const panelSchema = Schema({
    user : [{ type : Schema.Types.ObjectId , ref : 'User'}],
    name : { type : String, requred: true },
    name_family : { type : String, requred: true },
    phone : { type : String, requred: true },
    telphone: { type : String, requred: true },
    birth_year : { type : String , requred: true  },
    birth_day : { type : String, requred: true  },
    birth_month : { type : String , requred: true },
    certificate: { type : String , requred: true },
    codeM: { type : String , requred: true },
    men: { type : String , requred: true },
    woman: { type : String , requred: true },
    genders: { type : String , requred: true },
    location: { type : String , requred: true },
    state : { type : String , requred: true },
    city : { type : String , requred: true },
    address : { type : String, required : true  },
    postal_code : { type : String , required : true},
    cart : { type : String , required : true},
} , { timestamps : true, toJSON : { virtuals : true } });

panelSchema.plugin(mongoosePaginate); 

panelSchema.virtual('payment', {
    ref: 'Payment',
    localField : '_id',
    foreignField : 'panel'
})

module.exports = mongoose.model('Panel' , panelSchema);