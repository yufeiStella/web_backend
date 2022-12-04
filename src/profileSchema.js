const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    username: String,        
    status:  String,       
    headline: String,        
    following: Array,      
    email: String,     
    zipcode: String,    
    dob: Date,    
    avatar: String,
    phone: String,     
});

module.exports = profileSchema;