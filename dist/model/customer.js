"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const customerShema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true, lowercase: true, trim: true },
    lastName: { type: String, required: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    engineer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Engineer", required: true },
    createdAt: { type: String, default: Date.now },
    transactions: { type: Array, default: "" },
    customerId: { type: Number, required: true, unique: true, trim: true },
});
exports.default = mongoose_1.default.model('Customer', customerShema);
//# sourceMappingURL=customer.js.map