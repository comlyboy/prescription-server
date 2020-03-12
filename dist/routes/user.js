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
const user_1 = __importDefault(require("../model/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_check_1 = __importDefault(require("../middleware/auth-check"));
const router = express_1.default.Router();
let fetchedUser;
router.post("/user/signup", (req, res, next) => {
    bcryptjs_1.default.hash(req.body.password, 10)
        .then(hash => {
        const user = new user_1.default({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            phoneNumber: req.body.phoneNumber,
            branch: req.body.branch,
            password: hash
        });
        user.save()
            .then(result => {
            user_1.default.countDocuments()
                .then(count => {
                if (count == 1) {
                    user_1.default.updateOne({
                        _id: result._id
                    }, {
                        $set: {
                            role: 'admin',
                            isVerified: true
                        }
                    })
                        .then()
                        .catch(error => {
                        console.log(error);
                    });
                }
            })
                .catch(error => {
            });
            res.status(201).json({
                message: "Success!",
            });
        });
    })
        .catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
});
router.post('/user/login', (req, res, next) => {
    user_1.default.findOne({ userName: req.body.userName })
        .then(user => {
        fetchedUser = user;
        return bcryptjs_1.default.compare(req.body.password, user.password);
    })
        .catch(err => {
        return res.status(401).json({
            message: 'Not a registered user'
        });
    })
        .then(result => {
        if (!result) {
            return res.status(401).json({
                messsage: "Invalid password!"
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userName: fetchedUser.userName,
            userId: fetchedUser._id
        }, 'is_a_secret_dont_tell_anybody');
        res.status(200).json({
            message: `${fetchedUser.userName}, welcome `,
            role: fetchedUser.role,
            token: token,
            userId: fetchedUser.id
        });
    })
        .catch(err => {
        return res.status(500).json({
            message: "Something went wrong!"
        });
    });
});
router.put("/user/last_login/:_id", auth_check_1.default, userLastLogin);
function userLastLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let lastLogin_date = Date.now();
        try {
            const result = yield user_1.default.updateOne({
                _id: req.params._id
            }, {
                $set: {
                    lastLogin: lastLogin_date
                }
            }).exec();
            res.status(201).json({
                message: "Successfully!",
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
router.post('/user/reset-password', (req, res, next) => {
    user_1.default.findOne({ userName: req.body.userName })
        .then(user => {
        console.log(user);
        if (user.role == "blocked") {
            return res.status(401).json({
                messsage: "You have been blocked!"
            });
        }
        fetchedUser = user;
        return bcryptjs_1.default.compare(req.body.password, user.password);
    })
        .catch(err => {
        return res.status(401).json({
            message: 'Not a registered user'
        });
    })
        .then(result => {
        if (!result) {
            console.log(result);
            return res.status(401).json({
                messsage: "Invalid password!"
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userName: fetchedUser.userName,
            userId: fetchedUser._id
        }, 'is_a_secret_dont_tell_anybody', { expiresIn: '15h' });
        res.status(200).json({
            message: `${fetchedUser.userName}, welcome `,
            role: fetchedUser.role,
            token: token,
            expiresIn: 54000,
            userData: fetchedUser.id
        });
    })
        .catch(err => {
        return res.status(500).json({
            message: "Something went wrong!"
        });
    });
});
router.get("/user/:_id", auth_check_1.default, getSingleUser);
function getSingleUser(req, res, next) {
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
                message: "Somethiing went wrong!"
            });
        }
    });
}
router.put("/user/update_profile/:_id", auth_check_1.default, userUpdateProfile);
function userUpdateProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const _user = req.body;
        try {
            const user = yield user_1.default.findById({
                _id: req.params._id
            }).exec();
            if (!user) {
                return res.status(404).json({ message: "User not existing!" });
            }
            const userOriginalObject = yield JSON.parse(JSON.stringify(user));
            const userr = yield Object.assign({}, userOriginalObject, {
                firstName: _user.firstName,
                lastName: _user.lastName,
                email: _user.email,
                phoneNumber: _user.phoneNumber,
                address: _user.address
            });
            yield user_1.default.updateOne({ _id: req.params._id }, userr).then(result => {
                if (result.nModified > 0) {
                    res.status(200).json({ message: "Profile saved!" });
                }
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
exports.default = router;
//# sourceMappingURL=user.js.map