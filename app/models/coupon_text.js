const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const couponSchema = Schema({
    title : { type : String , required : true},
    slug : { type : String , required : true }, 
    lang : { type : String , required : true },
    body : { type : String, required : true},
    
} , { timestamps : true, toJSON : { virtuals : true }  });

couponSchema.methods.path = function(){
    return `/coupon/coupon_text/${this.slug}`
}

couponSchema.plugin(mongoosePaginate); 

module.exports = mongoose.model('Coupon_text' , couponSchema); 