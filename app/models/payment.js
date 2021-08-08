const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const paymentSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User' },
    engine: { type: Schema.Types.ObjectId, ref: "Engine", default : undefined },
    panel: { type: Schema.Types.ObjectId, ref: "Panel"},
    vip : { type : Boolean , default : false },
    resnumber : { type : String , required : true},
    price : { type : Number , required : true},
    payment : { type : Boolean , default : false },
    products: { type: JSON, default: null },
    proAddress: { type: JSON, default: null }
} , { timestamps : true , toJSON : { virtuals : true } });

paymentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Payment' , paymentSchema);