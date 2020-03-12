"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (req, res, next) => {
    try {
        const authorization = req.headers.authorization || "";
        const token = authorization.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token, 'is_a_secret_dont_tell_anybody');
        req["userData"] = { userName: decodedToken.userName, userId: decodedToken.userId };
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "You are not logged in!!!"
        });
    }
};
//# sourceMappingURL=auth-check.js.map