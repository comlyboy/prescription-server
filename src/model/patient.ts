import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


export interface IPatient {
    _id?: string;
    name: string;
    description: string
    addedAt?: string;
}




const patientShema = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    addedAt: { type: String, default: Date.now }
});



patientShema.plugin(uniqueValidator);

export default mongoose.model<any>('Patient', patientShema);