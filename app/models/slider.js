const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const sliderSchema = Schema({
    body : { type : String , required : true },
    file : { type : String},
} , { timestamps : true , toJSON : {virtuals : true}});

sliderSchema.plugin(mongoosePaginate);

sliderSchema.methods.path = function(){
    return `/sliders/${this.slug}`
}

sliderSchema.methods.inc = async function(field , num = 1) {
    this[field] += num;
    await this.save();
} 

module.exports = mongoose.model('Slider' , sliderSchema);