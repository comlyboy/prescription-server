"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const prescriptionShema = new mongoose_1.default.Schema({
    formula: { type: String, required: true, lowercase: true, trim: true },
    duration: { type: String, required: true, trim: true },
    isTaken: { type: Boolean, default: false },
    isViewed: { type: Boolean, default: false },
    drugId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Drug", required: true },
    patientId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Patient", required: true },
    createdAt: { type: String, default: Date.now },
    prescriptionId: { type: String, required: true, trim: true },
});
prescriptionShema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model('Prescription', prescriptionShema);
//# sourceMappingURL=prescription.js.map