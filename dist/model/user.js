"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const userShema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true, lowercase: true, trim: true },
    lastName: { type: String, required: true, lowercase: true, trim: true },
    userName: { type: String, required: true, lowercase: true, unique: true, trim: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    email: { type: String, lowercase: true, default: "", trim: true },
    address: { type: String, default: "" },
    position: { type: String, default: "" },
    branch: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Branch", required: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, default: "engineer" },
    registeredAt: { type: String, default: Date.now },
    lastLogin: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false }
});
userShema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model('User', userShema);
//# sourceMappingURL=user.js.map