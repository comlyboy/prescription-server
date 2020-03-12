"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const adminShema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true, trim: true },
    userName: { type: String, required: true, lowercase: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    isAdmin: { type: Boolean, default: true },
});
adminShema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model('Admin', adminShema);
//# sourceMappingURL=admin.js.map