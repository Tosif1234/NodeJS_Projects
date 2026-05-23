const {Schema, model} = require('mongoose');

const adminSchema = new Schema({
    fullName :{
        type : String,
        required : true
    },
    phoneNumber :{
        type : Number,
        required : true
    },
    email :{
        type : String,
        required : true
    },
    password :{
        type : String,
        required : true
    },
    role :{
        type : String,
        required : true
    },
    plan :{
        type : String,
        required : true
    },
    status :{
        type : String,
        required : true
    },
    Image:{
        type : String,
    },
    note :{
        type : String,
        required : true
    },
});

module.exports = model('admin', adminSchema);