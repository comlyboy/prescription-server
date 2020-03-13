import express from "express";

import authCheck from "../middleware/auth-check";
import { generateId } from "../helper/unique-id";
import Prescription, { IPrescription } from "../model/prescription";

const router = express.Router();



router.post("/prescription", authCheck, addPrescription);
function addPrescription(req: express.Request, res: express.Response, next: express.NextFunction) {

    const _prescription: IPrescription = req.body;

    let prescriptionId = generateId(8);

    const prescriptionOBJ = new Prescription({
        fomul: _prescription.fomula,
        duration: _prescription.duration
    });

    try {
        prescriptionOBJ.save();
        res.status(201).json({
            message: "Successfully!",
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }

}


// router.get("/transaction", authCheck, getTransactions);
// async function getTransactions(req: express.Request, res: express.Response, next: express.NextFunction) {
//     const limit = +req.query.limit;

//     let totalAmountSpent: number = 0;

//     try {
//         const customers: ICustomer[] = await Customer.find({
//             engineer: req["userData"].userId
//         }).select("_id").exec();
//         const customer_Ids = customers.map((item) => item._id);

//         const totalTransactions: number = await Transaction.countDocuments({ customerId: customer_Ids }
//         ).exec();
//         const transactions: ITransaction[] = await Transaction.find({
//             customerId: customer_Ids
//         }).sort('-transactionDate').exec();

//         const newCustomerIdss = transactions.map((item) => item.customerId);


//         const cust = await Customer.find({ _id: { $in: newCustomerIdss } }).exec();

//         const _fetchedtransactionsPlain: ICustomer[] = JSON.parse(JSON.stringify(transactions));
//         const _customers: any[] = JSON.parse(JSON.stringify(cust));


//         const _fetchedtransactions = _fetchedtransactionsPlain.map((item) => {
//             item["customerId"] = _customers.find((br) => br._id === item.customerId);
//             return item;
//         });

//         res.status(200).json({
//             transactions: _fetchedtransactions,
//             totalTransactions: totalTransactions
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Somethiing went wrong!"
//         });
//     }
// }
