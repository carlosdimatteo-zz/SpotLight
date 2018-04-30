const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//user shcema
const userSchema= mongoose.Schema({
    name:{
    type:String,
    required: true
    },
    email:{
        type:String,
        required: true
        },
        password:{
            type:String,
            required: true
            },
            username:{
                type:String,
                required: true
                },
                cart:[{
                    _id:{
                        type:Schema.Types.ObjectId,
                        ref:'Article',
                        required:true
                    },
                    quantity:{
                        type:Number,
                        required:true
                    }
                }]
});
const User = module.exports = mongoose.model('User',userSchema);