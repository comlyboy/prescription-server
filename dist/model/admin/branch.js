"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const branchSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, lowercase: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
});
branchSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model('Branch', branchSchema);
//# sourceMappingURL=branch.js.map