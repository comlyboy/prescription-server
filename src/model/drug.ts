import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


export interface IDrug {
    _id?: string;
    name: string;
    description: string
    addedAt?: string;
}




const drugShema = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    addedAt: { type: String, default: Date.now }
});



drugShema.plugin(uniqueValidator);

export default mongoose.model<any>('Drug', drugShema);