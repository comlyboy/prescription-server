import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


export interface IPrescription {
    _id?: string;
    formula: string;
    duration: string;
    isTaken: boolean;
    isViewed: boolean;
    drugId: string;
    patientId: string;
    createdAt?: string;
    prescriptionId?: string;
}



const prescriptionShema = new mongoose.Schema({
    formula: { type: String, required: true, lowercase: true, trim: true },
    duration: { type: String, required: true, trim: true },
    isTaken: { type: Boolean, default: false },
    isViewed: { type: Boolean, default: false },
    drugId: { type: mongoose.Schema.Types.ObjectId, ref: "Drug", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    createdAt: { type: String, default: Date.now },
    prescriptionId: { type: String, required: true, trim: true },
});



prescriptionShema.plugin(uniqueValidator);

export default mongoose.model<any>('Prescription', prescriptionShema);