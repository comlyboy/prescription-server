"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const patientShema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true, lowercase: true, trim: true },
    lastName: { type: String, required: true, lowercase: true, trim: true },
    gender: { type: String, required: true, lowercase: true, trim: true },
    age: { type: Number, required: true, trim: true },
    address: { type: String, required: true, lowercase: true, trim: true },
    addedAt: { type: String, default: Date.now },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
});
patientShema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model('Patient', patientShema);
//# sourceMappingURL=patient.js.map