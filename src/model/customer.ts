import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


export interface ICustomer {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    engineer: string;
    createdAt: string;
    transactions: any;
    customerId: string;
}

const customerShema = new mongoose.Schema({
    firstName: { type: String, required: true, lowercase: true, trim: true },
    lastName: { type: String, required: true, lowercase: true, trim: true },
    phoneNumber: { type: String, unique: true, required: true, trim: true },
    engineer: { type: mongoose.Schema.Types.ObjectId, ref: "Engineer", required: true },
    createdAt: { type: String, default: Date.now },
    transactions: { type: Array },
    customerId: { type: String, required: true, unique: true, trim: true },
});

customerShema.plugin(uniqueValidator);


export default mongoose.model<any>('Customer', customerShema);