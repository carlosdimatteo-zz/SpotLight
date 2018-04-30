let mongoose = require ('mongoose');
let Schema= mongoose.Schema;

//articl schema
let articleSchema= mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true

    },
    body:{
        type: String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    }
});
let Article= module.exports = mongoose.model('Article',articleSchema);
