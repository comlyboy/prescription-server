import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


export interface IPrescription {
    _id?: string;
    fomula: string;
    duration: string
    patientId: string
    createdAt: string
}



const prescriptionShema = new mongoose.Schema({
    patientName: { type: String, required: true, lowercase: true, trim: true },
    age: { type: Number, required: true, trim: true },
    fomula: { type: String, required: true, lowercase: true, trim: true },
    duration: { type: String, required: true, trim: true },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    createdAt: { type: String, default: Date.now }
});



prescriptionShema.plugin(uniqueValidator);

export default mongoose.model<any>('Prescription', prescriptionShema);