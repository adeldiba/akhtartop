const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const availableSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User' },
    engine: { type: Schema.Types.ObjectId, ref: "Engine"},
    bywhom :String,
    totalcount:{
    	type    : Number,
    	default : 0
    }
} , { timestamps : true , toJSON : { virtuals : true } });

availableSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Available' , availableSchema);