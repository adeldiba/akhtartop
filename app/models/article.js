const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const articleSchema = Schema({
    title : { type : String , required : true},
    slug : { type : String , required : true }, 
    lang : { type : String , required : true },
    body : { type : String, required : true},
    
} , { timestamps : true, toJSON : { virtuals : true }  });

articleSchema.plugin(mongoosePaginate); 

articleSchema.methods.path = function(){
    return `/vip/articles/${this.slug}`
}

module.exports = mongoose.model('Article' , articleSchema); 