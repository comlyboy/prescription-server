import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


export interface IPrescription {
    _id?: string;
    drugId: string;
    fomula: string;
    duration: string
    patientId: string
    createdAt: string
}



const prescriptionShema = new mongoose.Schema({
    drugId: { type: mongoose.Schema.Types.ObjectId, ref: "Drug", required: true },
    fomula: { type: String, required: true, lowercase: true, trim: true },
    duration: { type: String, required: true, trim: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    createdAt: { type: String, default: Date.now }
});



prescriptionShema.plugin(uniqueValidator);

export default mongoose.model<any>('Prescription', prescriptionShema);