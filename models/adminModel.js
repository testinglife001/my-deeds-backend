import mongoose from "mongoose";
// const {Schema,model} = require('mongoose');

const adminSchema = new mongoose.Schema({
    adminName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
    role : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    }
},{timeseries : true});


// module.exports = model('admin',adminSchema);
export const Admin = mongoose.model("admin", adminSchema);

// const adminModel = model("admin", adminSchema);
// module.exports = adminModel;

// module.exports = model('admin',adminSchema);

