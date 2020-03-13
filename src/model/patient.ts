import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


export interface IPatient {
    _id?: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    age: number;
    address: string
    addedAt?: string;
    userId?: string;
}




const patientShema = new mongoose.Schema({
    firstName: { type: String, required: true, lowercase: true, trim: true },
    lastName: { type: String, required: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true, lowercase: true, trim: true },
    age: { type: Number, required: true, trim: true },
    address: { type: String, required: true, lowercase: true, trim: true },
    addedAt: { type: String, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});



patientShema.plugin(uniqueValidator);

export default mongoose.model<any>('Patient', patientShema);