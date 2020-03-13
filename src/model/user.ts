// Engineer schema

//@ts-check
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


export interface IUser {
    _id?: string
    firstName: string;
    lastName: string;
    userName: string;
    password?: string;
}

const userShema = new mongoose.Schema({
    firstName: { type: String, required: true, lowercase: true, trim: true },
    lastName: { type: String, required: true, lowercase: true, trim: true },
    userName: { type: String, required: true, lowercase: true, unique: true, trim: true },
    password: { type: String, required: true }
});



userShema.plugin(uniqueValidator);

export default mongoose.model<any>('User', userShema);