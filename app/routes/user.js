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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_check_1 = __importDefault(require("../middleware/auth-check"));
const user_1 = __importDefault(require("../model/user"));
const router = express_1.default.Router();
router.post("/signup", signupUser);
function signupUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_req_body = req.body;
        try {
            console.log(user_req_body);
            const hash = yield bcryptjs_1.default.hash(req.body.password, 10);
            const new_user_obj = new user_1.default({
                firstName: user_req_body.firstName,
                lastName: user_req_body.lastName,
                userName: user_req_body.userName,
                email: user_req_body.email,
                password: hash
            });
            console.log(new_user_obj);
            const result = yield new_user_obj.save();
            console.log(result);
            res.status(201).json({
                message: "Success!",
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    });
}
router.post('/login', loginUser);
function loginUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fetchedUser = yield user_1.default.findOne({ userName: req.body.userName }).exec();
            if (!fetchedUser) {
                return res.status(401).json({
                    message: 'Not a registered user'
                });
            }
            const hashResult = yield bcryptjs_1.default.compare(req.body.password, fetchedUser.password);
            if (!hashResult) {
                return res.status(401).json({
                    message: "Invalid password!"
                });
            }
            const token = jsonwebtoken_1.default.sign({
                userName: fetchedUser.userName,
                userId: fetchedUser._id
            }, 'is_a_secret_dont_tell_anybody');
            res.status(200).json({
                message: `${fetchedUser.userName}, welcome `,
                token: token,
                userId: fetchedUser.id
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    });
}
router.get("/user/:_id", auth_check_1.default, getUserProfile);
function getUserProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.default.findById({
                _id: req.params._id
            }, { password: false }).exec();
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({ message: "User does not exist!" });
            }
        }
        catch (error) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    });
}
exports.default = router;
//# sourceMappingURL=user.js.map