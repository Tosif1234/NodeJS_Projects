const {Schema, model} = require("mongoose");

const MovieSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    desc : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true
    },
    year : {
        type : String,
        required : true
    },
    isTrending : {
        type : Boolean,
        required : true
    },
},{
    timestamps :true
});

module.exports = model("Movie",MovieSchema);