import express from "express";
import Customer, { ICustomer } from "../model/customer";
import authCheck from "../middleware/auth-check";

const router = express.Router();


router.get("/metrics/repaired", authCheck, (req, res, next) => {
    Customer.find({ status: "Repaired", isCollected: false, engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
            res.status(200).json({
                message: "Customers fetched!!!",
                totalRepaired: documents
            });
        });
});

// router.get("/metr", authCheck, (req, res, next) => {
//     let fetchedAll: number;
//     let fetchedProgress: number;
//     let fetchedRepaired: number;
//     let fetchedUnrepaired: number;
//     let fetchedDelivered: number;

//     Customer.find({ status: "Repaired", isDelivered: false, engineer: req["userData"].userId })
//         .countDocuments()
//         .then(documents => {
//             fetchedRepaired = documents;

//             Customer.find({ status: "In progress", engineer: req["userData"].userId })
//                 .countDocuments()
//                 .then(documents => {
//                     fetchedProgress = documents;

//                     Customer.find({ status: "Unrepaired", engineer: req["userData"].userId })
//                         .countDocuments()
//                         .then(documents => {
//                             fetchedUnrepaired = documents;

//                             Customer.find({ status: "Repaired", isDelivered: true, engineer: req["userData"].userId })
//                                 .countDocuments()
//                                 .then(documents => {
//                                     fetchedDelivered = documents;

//                                     res.status(200).json({
//                                         res.status(200).json({
//                                             message: "Customers fetched!!!",
//                                             totalRepaired: documents
//                                         });
//                                     });
//                                 });


router.get("/metrics/progress", authCheck, (req, res, next) => {
    Customer.find({ status: "In progress", engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
            res.status(200).json({
                message: "Customers fetched!!!",
                totalProgress: documents
            });
        });
});


router.get("/metrics/unrepaired", authCheck, (req, res, next) => {
    Customer.find({ status: "Unrepaired", engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
            res.status(200).json({
                message: "Unrepaired devices fetched!!!",
                totalUnrepaired: documents
            });
        });
});


router.get("/metrics/delivered", authCheck, (req, res, next) => {
    Customer.find({ status: "Repaired", isCollected: true, engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
            res.status(200).json({
                message: "Customers fetched!!!",
                totalDelivered: documents
            });
        });
});


// Device type metrics
router.get("/metrics/ios", authCheck, (req, res, next) => {
    Customer.find({ deviceType: "IOS", engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
            res.status(200).json({
                message: "Customers fetched!!!",
                totalDelivered: documents
            });
        });
});


router.get("/metrics/android", authCheck, (req, res, next) => {
    Customer.find({ deviceType: "Android", engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
            res.status(200).json({
                message: "Customers fetched!!!",
                totalDelivered: documents
            });
        });
});


router.get("/metrics/pc", authCheck, (req, res, next) => {
    Customer.find({ deviceType: "Pc", engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
            res.status(200).json({
                message: "Customers fetched!!!",
                totalDelivered: documents
            });
        });
});


router.get("/metrics/window", authCheck, (req, res, next) => {
    Customer.find({ deviceType: "Window phone" })
        .countDocuments()
        .then(documents => {
            res.status(200).json({
                message: "Customers fetched!!!",
                totalDelivered: documents
            });
        });
});


router.get("/metrics/electronics", authCheck, (req, res, next) => {
    Customer.find({
        deviceType: "Electronics",
        engineer: req["userData"].userId
    })
        .countDocuments()
        .then(documents => {
            res.status(200).json({
                message: "Customers fetched!!!",
                totalDelivered: documents
            });
        });
});


router.get("/metrics/others", authCheck, (req, res, next) => {
    Customer.find({ deviceType: "Others", engineer: req["userData"].userId })
        .countDocuments()
        .then(documents => {
            res.status(200).json({
                message: "Customers fetched!!!",
                totalDelivered: documents
            });
        });
});


router.get('/metrics/amount', authCheck, (req, res, next) => {
    Customer.find({ engineer: req["userData"].userId })
        .select('amount')
        .then(result => {
            let totalCharge: number = 0;
            result.forEach(d => {
                totalCharge += d.amount;
                // totalAmount = totalAmount + d.amount;
            });
            res.json({
                message: 'Amounts fetched!!!',
                amounts: totalCharge
            })
        });
});


router.get('/metrics/advance', authCheck, (req, res, next) => {
    Customer.find({ engineer: req["userData"].userId })
        .select('advance')
        .then(result => {
            let totalAdvance: number = 0;
            if (result) {
                result.forEach(d => {
                    totalAdvance += d.advance
                    // totalAmount = totalAmount + d.amount;
                });
                res.json({
                    message: 'Advances found!!!',
                    amountPaid: totalAdvance
                })
            }

        });
});

export default router;
