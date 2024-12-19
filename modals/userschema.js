import mongoose from "mongoose";
import AuthRoles from "../utilis/authRoles"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import crypto from "crypto"
import { config } from "dotenv";


const userSchema = mongoose.Schema(
    {
    name:{
        type:String,
        required:[true,"Name is required"],
        maxLength:[50,"Name must be less than 50"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
       unique:true   
    },
    password:{
        type:String,
        required:[true,"Password is required"],
       minLength:[8,"password must be atleast 8 character long"] ,
    select:false
  },
role:{
    type:String,
enum:Object.values(AuthRoles),
default:AuthRoles.USER 
},
forgotPasswordToken:String,
forgotPasswordExpiry:Date,
},
{
timestamps:true
}
);

//encrypt password
//pre is hook in mongoose
userSchema.pre("save",async function(next){
    if(!this.modified("password"))return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

//add more features directly to Schema
userSchema.methods ={
    //compare password
    comparePassword :async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
    },
//generate JWT Token
getJwtToken: function(){
return JWT.sign({
_id:this._id,
role:this.role 

},
config.JWT_SECRET,
{
    expiresIn:config.JWT_EXPIRY
}
)
}

}


export default mongoose.model("User",userSchema)


