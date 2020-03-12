// Engineer schema

//@ts-check
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


export interface ITransaction {
    _id: string;
    deviceType: string;
    brandModel: string;
    imei: string;
    status: string;
    amount: number;
    advance: number;
    description: string;
    isCollected: boolean;
    customerId: any;
    transactionDate: Date;
    transactionId: string;
}


const transactionShema = new mongoose.Schema({
    deviceType: { type: String, required: true, trim: true },
    brandModel: { type: String, required: true, trim: true },
    imei: { type: String, required: true, trim: true },
    status: { type: String, trim: true, default: "In progress" },
    amount: { type: Number, required: true, trim: true },
    advance: { type: Number, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    isCollected: { type: Boolean, default: false },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    transactionDate: { type: String, default: Date.now },
    transactionId: { type: String, required: true, unique: true, trim: true },
});


transactionShema.plugin(uniqueValidator);

export default mongoose.model<any>('Transaction', transactionShema);