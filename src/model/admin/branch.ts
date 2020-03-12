//@ts-check

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


export interface IBranch {
    _id?: string
    name: string;
    description: string;
}

const branchSchema = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
});


branchSchema.plugin(uniqueValidator);

export default mongoose.model<any>('Branch', branchSchema);