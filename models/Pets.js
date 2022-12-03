const mongoose = require('../db/conn')
const {Schema} = mongoose

const  Pet  = mongoose.model(
    'Pet',
    new Schema({
        name:{String,
        require:true
        },
        age:{
            type:Number,
            required:true
        },
        weight:{
            type:Number,
            require:true
        },
        color:{
            type:String,
            require:true
        },
        images:{
            type:Array,
            require:true
        },
        available:{
            type:Boolean
        },
        user: Object,
        adopter: Object


    },

    {timestamps:true},

    
    {
        timestamps:true
    },
     
    )
)
module.exports = Pet