// Engineer schema

//@ts-check
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


export interface ISignup {
    _id?: string;
    firstName: string;
    lastName: string;
    userName: string;
    phoneNumber: string;
    branch: string;
    password: string
}


export interface ILogin {
    _id?: string;
    userName: string;
    password: string
}

export interface IUser {
    _id?: string
    firstName: string;
    lastName: string;
    userName: string;
    phoneNumber: string;
    email: string;
    address: string;
    position: string;
    branch: string;
    password: string;
    role: string;
    registeredAt: Date;
    isActive: boolean;
    isVerified: boolean;
}


const userShema = new mongoose.Schema({
    firstName: { type: String, required: true, lowercase: true, trim: true },
    lastName: { type: String, required: true, lowercase: true, trim: true },
    userName: { type: String, required: true, lowercase: true, unique: true, trim: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    email: { type: String, lowercase: true, default: "", trim: true },
    address: { type: String, default: "" },
    position: { type: String, default: "" },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, default: "engineer" },
    registeredAt: { type: String, default: Date.now },
    lastLogin: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false }
});



userShema.plugin(uniqueValidator);

export default mongoose.model<any>('User', userShema);