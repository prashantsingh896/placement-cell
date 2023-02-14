const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const interviewSchema = new Schema({
    company:{
        type: String,
        require:true
    },
    date:{
        type: String,
        required: true
    },
    students:[
        {
            student:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'Student'
            },
            result:{
                type: String,
                enum:["Pass","On Hold", "Fail", "Didn't attempt"].map(status=>status.toLowerCase())
            }

        }
    ]
},{timestamps:true});

module.exports = new mongoose.model('Interview', interviewSchema);

