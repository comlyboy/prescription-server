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
const customer_1 = __importDefault(require("../model/customer"));
const auth_check_1 = __importDefault(require("../middleware/auth-check"));
const router = express_1.default.Router();
const definedDevices = {
    android: "Android",
    ios: "IOS",
    pc: "Pc",
    electronics: "Electronics",
    windows_phone: "Windows phone",
    others: "Others"
};
const definedStatus = {
    progress: "In progress",
    repaired: "Repaired",
    unrepaired: "Unrepaired",
    collected: true,
};
router.get("/works/repaired", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({
        status: definedStatus.repaired,
        isCollected: !definedStatus.collected, engineer: req["userData"].userId
    })
        .sort("-createdAt")
        .limit(7)
        .then(documents => {
        if (documents) {
            res.status(200).json({
                message: "Repaired devices fetched!!!",
                allRepaired: documents
            });
        }
        else {
            res.status(404).json({ message: "can't find repaired Devices!" });
        }
    })
        .catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
});
function getAllJobs(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const definedStatus = {
            progress: "In progress",
            repaired: "Repaired",
            unrepaired: "Unrepaired",
            collected: true,
        };
        try {
            const totalCustomers = yield customer_1.default.find()
                .countDocuments().exec();
            const repaired = yield customer_1.default.find({
                status: definedStatus.repaired, isCollected: !definedStatus.collected
            }).sort("-createdAt")
                .limit(6).exec();
            const progress = yield customer_1.default.find({
                status: definedStatus.progress
            }).sort("-createdAt")
                .limit(6).exec();
            const unrepaired = yield customer_1.default.find({
                status: definedStatus.unrepaired
            }).sort("-createdAt")
                .limit(6).exec();
            const collected = yield customer_1.default.find({
                status: definedStatus.repaired, isCollected: definedStatus.collected
            }).sort("-createdAt")
                .limit(6).exec();
            res.status(200).json({
                totalWorks: totalCustomers,
                allRepaired: repaired,
                allInProgress: progress,
                allUnrepaired: unrepaired,
                allCollected: collected,
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    });
}
router.get("/works/progress", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ status: "In progress", engineer: req["userData"].userId })
        .sort("-createdAt")
        .limit(7)
        .then(documents => {
        if (documents) {
            res.status(200).json({
                message: "Customers fetched!!!",
                allInProgress: documents
            });
        }
        else {
            res.status(404).json({ message: "can't find status!" });
        }
    })
        .catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
});
router.get("/works/unrepaired", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ status: "Unrepaired", engineer: req["userData"].userId })
        .sort("-createdAt")
        .limit(7)
        .then(documents => {
        if (documents) {
            res.status(200).json({
                message: "Repaired devices fetched!!!",
                allUnrepaired: documents
            });
        }
        else {
            res.status(404).json({ message: "can't find unrepaired Devices!" });
        }
    })
        .catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
});
router.get("/works/delivered", auth_check_1.default, (req, res, next) => {
    customer_1.default.find({ isCollected: true, engineer: req["userData"].userId })
        .sort("-createdAt")
        .limit(7)
        .then(documents => {
        if (documents) {
            res.status(200).json({
                message: "Repaired devices fetched!!!",
                allDelivered: documents
            });
        }
        else {
            res.status(404).json({ message: "can't find delivered Devices!" });
        }
    })
        .catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
});
router.put("/works/update/repaired/:_id", (req, res, next) => {
    customer_1.default.updateOne({
        _id: req.params._id
    }, {
        $set: {
            status: "Repaired"
        }
    })
        .then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: "Successfull!" });
        }
        else {
            res.status(401).json({ message: "Not successfull!!!" });
        }
    })
        .catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
});
router.put("/works/update/progress/:_id", (req, res, next) => {
    customer_1.default.updateOne({
        _id: req.params._id
    }, {
        $set: {
            status: "In progress"
        }
    })
        .then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: "Successfull!" });
        }
        else {
            res.status(401).json({ message: "Not successfull!!!" });
        }
    })
        .catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
});
router.put("/works/update/delivered/:_id", (req, res, next) => {
    console.log(req.params._id);
    customer_1.default.updateOne({
        _id: req.params._id
    }, {
        $set: {
            isCollected: true
        }
    })
        .then(result => {
        if (result.n > 0) {
            console.log(result);
            res.status(200).json({ message: "Successfull!" });
        }
        else {
            res.status(401).json({ message: "Not successfull!!!" });
        }
    })
        .catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
});
router.put("/works/update/unrepaired/:_id", (req, res, next) => {
    console.log(req.params._id);
    customer_1.default.updateOne({
        _id: req.params._id
    }, {
        $set: {
            status: "Unrepaired"
        }
    })
        .then(result => {
        if (result.n > 0) {
            console.log(result);
            res.status(200).json({ message: "Successfull!!!" });
        }
        else {
            res.status(401).json({ message: "Not successfull!!!" });
        }
    })
        .catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
});
exports.default = router;
//# sourceMappingURL=works.js.map