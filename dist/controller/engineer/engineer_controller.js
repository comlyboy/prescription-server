"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../../model/user"));
const branch_1 = __importDefault(require("../../model/admin/branch"));
const router = express_1.default.Router();
const definedRoles = {
    engineer: "engineer"
};
function getEngineers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const branchQuery = req.query.branch;
        const positionQuery = req.query.position;
        const SearchQuery = req.query.search;
        let fetchedEngineers;
        let query;
        if (branchQuery) {
            query = user_1.default.find({ branch: branchQuery, role: definedRoles.engineer });
        }
        else {
            query = user_1.default.find({ role: definedRoles.engineer }, { password: false });
        }
        try {
            const fetchedEngineers = yield query.sort("firstName").exec();
            const branchIds = fetchedEngineers.map((item) => item.branch);
            const count = yield user_1.default.countDocuments({ role: definedRoles.engineer }).exec();
            const branch = yield branch_1.default.find({ _id: { $in: branchIds } }).exec();
            const _fetchedEngineersPlain = JSON.parse(JSON.stringify(fetchedEngineers));
            const _branch = JSON.parse(JSON.stringify(branch));
            const _fetchedEngineers = _fetchedEngineersPlain.map((item) => {
                item["branch"] = _branch.find((br) => br._id === item.branch);
                return item;
            });
            console.log({ fetchedEngineers });
            res.status(200).json({
                message: "Engineers fetched!!!",
                allEngineers: _fetchedEngineers,
                totalEngineers: count
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    });
}
exports.getEngineers = getEngineers;
//# sourceMappingURL=engineer_controller.js.map