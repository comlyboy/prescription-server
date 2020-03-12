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
const random_1 = __importDefault(require("random"));
const customer_1 = __importDefault(require("../model/customer"));
const auth_check_1 = __importDefault(require("../middleware/auth-check"));
const router = express_1.default.Router();
router.post("/customers", auth_check_1.default, addCustomer);
function addCustomer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const _customer = req.body;
        let customerId = random_1.default.int(1111111, 9999999);
        const customer = new customer_1.default({
            firstName: _customer.firstName,
            lastName: _customer.lastName,
            phoneNumber: _customer.phoneNumber,
            engineer: req["userData"].userId,
            customerId: customerId,
        });
        try {
            const result = yield customer.save();
            res.status(201).json({
                message: "Added successfully!!!",
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
router.get("/customers", auth_check_1.default, (req, res, next) => {
    const customerPerPage = +req.query.pagesize;
    const currentPage = +req.query.page;
    const deviceTypeQuery = req.query.devicetype;
    const deviceStatusQuery = req.query.devicestatus;
    const searchinput = req.query.search;
    let customerQuery = customer_1.default.find({
        engineer: req["userData"].userId
    });
    let fetchedCustomers;
    if (deviceTypeQuery) {
        customerQuery = customer_1.default.find({
            deviceType: deviceTypeQuery,
            engineer: req["userData"].userId
        });
    }
    if (customerPerPage && currentPage && !deviceTypeQuery) {
        customerQuery
            .skip(customerPerPage * (currentPage - 1))
            .limit(customerPerPage);
    }
    customerQuery
        .sort("-createdAt")
        .then(document => {
        fetchedCustomers = document;
        return customer_1.default.countDocuments({ engineer: req["userData"].userId });
    })
        .then(count => {
        res.status(200).json({
            message: "Customer fetched!",
            customers: fetchedCustomers,
            totalCustomers: count
        });
    })
        .catch(error => {
        res.status(500).json({
            message: "Something went wrong!"
        });
    });
});
router.get("/customers/:_id", auth_check_1.default, getCustomers);
function getOneCustomers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const customer = yield customer_1.default.findOne({
                _id: req.params._id,
                engineer: req["userData"].userId
            });
            console.log(customer);
            if (customer) {
                res.status(200).json(customer);
            }
            else {
                res.status(404).json({ message: "Customer does not exist!" });
            }
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
router.get("/customers/:_id", auth_check_1.default, getCustomers);
function getCustomers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const customer = yield customer_1.default.findById({
                _id: req.params._id,
                engineer: req["userData"].userId
            });
            console.log(customer);
            if (customer) {
                res.status(200).json(customer);
            }
            else {
                res.status(404).json({ message: "Customer does not exist!" });
            }
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
router.delete("/customers/:_id", auth_check_1.default, deleteCustomer);
function deleteCustomer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield customer_1.default.deleteOne({
                _id: req.params._id,
                engineer: req["userData"].userId
            });
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
router.put("/customers/:_id", auth_check_1.default, (req, res, next) => {
    const _customer = req.body;
    customer_1.default.findById({
        _id: req.params._id,
        engineer: req["userData"].userId
    })
        .then(customerDb => {
        if (customerDb) {
            const custRealObj = JSON.parse(JSON.stringify(customerDb));
            const customer = Object.assign({}, custRealObj, {
                firstName: _customer.firstName,
                lastName: _customer.lastName,
                phoneNumber: _customer.phoneNumber
            });
            customer_1.default.updateOne({ _id: req.params._id, engineer: req["userData"].userId }, customer)
                .then(result => {
                if (result.nModified > 0) {
                    res.status(200).json({ message: "Updated successfully!" });
                }
                else {
                    res.status(401).json({ message: "You are not authorised!" });
                }
            })
                .catch(error => {
                res.status(500).json({
                    message: "Something went wrong!"
                });
            });
        }
        else {
            res.status(404).json({ message: "can't find customer!" });
        }
    });
});
router.get("/customer/find/:phone", auth_check_1.default, getOnCustomerByPhoneNumber);
function getOnCustomerByPhoneNumber(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const customer = yield customer_1.default.findOne({
                phoneNumber: req.params.phone,
                engineer: req["userData"].userId
            });
            res.status(200).json(customer);
        }
        catch (error) {
            res.status(500).json({
                message: "Somethiing went wrong!"
            });
        }
    });
}
exports.default = router;
//# sourceMappingURL=customer.js.map