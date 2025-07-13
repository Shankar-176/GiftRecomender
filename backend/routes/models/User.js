import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// ✅ Define methods BEFORE exporting the model
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, { expiresIn: "120d" });
};

// ✅ Fix OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).required().label("First Name"),
        lastName: Joi.string().min(2).required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity({
            min: 8,
            max: 30,
            numeric: 1,
            lowerCase: 1,
            upperCase: 1,
            special: 1
        }).required().label("Password"),
    });
    return schema.validate(data);
};



export { User, validate };
