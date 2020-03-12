import express from "express";

import Transaction, { ITransaction } from "../model/transaction";
import Customer, { ICustomer } from "../model/customer";

import authCheck from "../middleware/auth-check";
import { getTransactionId } from "../helper/unique-id";

const router = express.Router();



router.post("/transactions", authCheck, addTransaction);
async function addTransaction(req: express.Request, res: express.Response, next: express.NextFunction) {

    const _transaction: ITransaction = req.body;
    let transactId = getTransactionId(8);

    const transactionOBJ = new Transaction({
        deviceType: _transaction.deviceType,
        brandModel: _transaction.brandModel,
        imei: _transaction.imei,
        amount: _transaction.amount,
        advance: _transaction.advance,
        description: _transaction.description,
        customerId: _transaction.customerId,
        transactionId: transactId,
    });

    try {
        await transactionOBJ.save();
        res.status(201).json({
            message: "Successfully!",
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }

}


// Getting one customer for editing and details pages
router.get("/transaction", authCheck, getTransactions);
async function getTransactions(req: express.Request, res: express.Response, next: express.NextFunction) {
    const limit = +req.query.limit;

    let totalAmountSpent: number = 0;

    try {
        const customers: ICustomer[] = await Customer.find({
            engineer: req["userData"].userId
        }).select("_id").exec();
        const customer_Ids = customers.map((item) => item._id);

        const totalTransactions: number = await Transaction.countDocuments({ customerId: customer_Ids }
        ).exec();
        const transactions: ITransaction[] = await Transaction.find({
            customerId: customer_Ids
        }).sort('-transactionDate').exec();

        const newCustomerIdss = transactions.map((item) => item.customerId);


        const cust = await Customer.find({ _id: { $in: newCustomerIdss } }).exec();

        const _fetchedtransactionsPlain: ICustomer[] = JSON.parse(JSON.stringify(transactions));
        const _customers: any[] = JSON.parse(JSON.stringify(cust));


        const _fetchedtransactions = _fetchedtransactionsPlain.map((item) => {
            item["customerId"] = _customers.find((br) => br._id === item.customerId);
            return item;
        });

        res.status(200).json({
            transactions: _fetchedtransactions,
            totalTransactions: totalTransactions
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }
}


// Getting one customer for editing and details pages
router.get("/transaction/:_id", authCheck, getTransactionById);
async function getTransactionById(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        const transaction: ITransaction = await Transaction.findById({
            _id: req.params._id,
        })

        const customer: ICustomer = await Customer.findById({
            _id: transaction._id
            // engineer: req["userData"].userId
        })


        res.status(200).json({
            transaction: transaction,
            customer: customer
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }
}




// Getting one customer for editing and details pages
// router.get("/transactionss", authCheck, getCustomerTransactions);
// async function getCustomerTransactions(req: express.Request, res: express.Response, next: express.NextFunction) {
//     const customerId = req.query.customer_Id;
//     const limit = +req.query.limit;

//     let totalAmountSpent: number = 0;

//     try {

//         const transactions: ITransaction[] = await Transaction.find({
//             customerId: customerId
//         })
//         transactions.forEach(d => {
//             totalAmountSpent += d.advance
//         });

//         const totalTransactions: number = transactions.length
//         console.log(transactions)
//         console.log(totalAmountSpent)
//         console.log(totalTransactions)

//         res.status(200).json({
//             transaction: {
//                 totalTransactions: totalTransactions,
//                 totalAmountSpent: totalAmountSpent,
//                 transactions: transactions,
//             }
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Somethiing went wrong!"
//         });
//     }
// }


// Deleting a transaction
router.delete("/transactions/:_id", authCheck, deleteTransaction);
async function deleteTransaction(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        await Transaction.deleteOne({
            _id: req.params._id,
            engineer: req["userData"].userId
        })

        res.status(201).json({
            message: "Successfully!",
        });

    } catch (error) {
        res.status(500).json({
            message: "Somethiing went wrong!"
        });
    }

}



export default router;