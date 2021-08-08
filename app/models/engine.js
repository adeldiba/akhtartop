const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const engineSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    categories : [{type : Schema.Types.ObjectId, ref : 'Category'}],
    devices : [{type : Schema.Types.ObjectId, ref : 'Device'}],
    brands : [{type : Schema.Types.ObjectId, ref : 'Brand'}],
    countries : [{type : Schema.Types.ObjectId, ref : 'Country'}],
    title : { type : String , required : true },
    titleE : { type : String , required : true },
    slug : { type : String , required : true },
    type : { type : String , required : true },
    typetwo : { type : String , required : true },
    body : { type : String  },
    body2 : { type : String  },
    body3 : { type : String },
    body4 : { type : String  },
    model : { type : String , required : true },
    price : { type : String , required : true },
    file : { type : String },
    file2 : { type : String },
    key : { type : String},
    lang : { type : String , required : true },
    viewCount : { type : Number , default : 0 },
    commentCount : { type : Number , default : 0 },
} , { timestamps : true , toJSON : {virtuals : true}});

engineSchema.plugin(mongoosePaginate);

engineSchema.methods.path = function(){
    return `/engines/${this.slug}`
}

engineSchema.methods.typeToPersian = function() {
    switch (this.type) {
        case 'bestsellers':
                return 'پرفروش ها'
            break;
        case 'popular':
            return 'محبوب ترین ها'
        break;
        case 'new':
            return 'جدید ترین ها'
        break;    
    }
}
engineSchema.methods.typetwoToPersian = function() {
    switch (this.typetwo) {
        case 'available':
                return 'موجود'
            break;
        case 'notavailable':
            return 'موجود نیست'
        break;    
    }
}

engineSchema.methods.inc = async function(field , num = 1) {
    this[field] += num;
    await this.save();
} 

const engineBelong = doc => {
    if(doc.episode)
        return 'Episode'
}

engineSchema.virtual('belongTo' , {
    ref : engineBelong,
    localField : doc => engineBelong(doc).toLowerCase(),
    foreignField : '_id',
    justOne : true
})

engineSchema.virtual('episodes' , {
    ref : 'Episode',
    localField : '_id',
    foreignField : 'engine'
})

engineSchema.virtual('comments', {
    ref : 'Comment',
    localField : '_id',
    foreignField : 'engine'
})


module.exports = mongoose.model('Engine' , engineSchema);