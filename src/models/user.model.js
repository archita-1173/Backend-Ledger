const mongoose= require('mongoose');

const userSchema= new mongoose.Schema({
    email:{
        type: String,
        required:[true, 'Email is required'],
        trim: true,
        lowercase: true,
        match:[/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, 'Please provide a valid email address'],
        unique:[true, 'Email already exists']
    },
    name:{
        type: String,
        required:[true, 'Name is required'],
    },
    password:{
        type: String,
        required:[true, 'Password is required'],
        minlength:[6, 'Password must be at least 6 characters long']    ,
        select:false,
    }
}, {
    timestamps: true
});