import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


export interface IDrug {
    _id?: string;
    name: string;
    description: string
}




const drugShema = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
});



drugShema.plugin(uniqueValidator);

export default mongoose.model<any>('Drug', drugShema);