"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const transactionShema = new mongoose_1.default.Schema({
    deviceType: { type: String, required: true, trim: true },
    brandModel: { type: String, required: true, trim: true },
    imeiNumber: { type: String, required: true, trim: true },
    status: { type: String, trim: true, default: "In progress" },
    amount: { type: Number, required: true, trim: true },
    advance: { type: Number, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    isCollected: { type: Boolean, default: false },
    customerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Customer", required: true },
    engineer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Engineer", required: true },
    transactionDate: { type: String, default: Date.now },
    referenceNumber: { type: Number, required: true, unique: true, trim: true },
});
transactionShema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model('Transaction', transactionShema);
//# sourceMappingURL=transaction.js.map