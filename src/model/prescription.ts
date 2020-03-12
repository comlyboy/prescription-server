import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


export interface IPrescription {
    _id?: string;
    fomula: string;
    duration: string
}



const prescriptionShema = new mongoose.Schema({
    fomula: { type: String, required: true, lowercase: true, trim: true },
    duration: { type: String, required: true, trim: true },
});



prescriptionShema.plugin(uniqueValidator);

export default mongoose.model<any>('Drug', prescriptionShema);