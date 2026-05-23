const {Schema, model} = require('mongoose');

const bookSchema = new Schema({
    Title :{
        type : String,
        required : true
    },
    Author :{
        type : String,
        required : true
    },
    Category :{
        type : [String],
        required : true
    },
    Price :{
        type : Number,
        required : true
    },
    Quantity :{
        type : Number,
        required : true
    },
    Description :{
        type : String,
        required : true
    },
    Image :{
        type : String,
        required : true
    },
    
})

module.exports = model('BookStore',bookSchema);