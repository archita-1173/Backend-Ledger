const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');

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
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return next();

    const hash= await bcrypt.hash(this.password, 10);
    this.password= hash;
    
});

userSchema.methods.comparePassword= async function(password){
    return await bcrypt.compare(password, this.password);
}

const userModel= mongoose.model('user', userSchema);
module.exports= userModel;