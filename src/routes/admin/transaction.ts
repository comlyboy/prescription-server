import express from 'express';

import adminCheck from '../../middleware/admin-check';

import Customer, { ICustomer } from "../../model/customer";
import Transaction, { ITransaction } from '../../model/transaction';


const router = express.Router();

// Getting customers from database
router.get("/transaction", adminCheck, getTransactions);
async function getTransactions(req: express.Request, res: express.Response, next: express.NextFunction) {
    const transactionsPerPage = +req.query.pagesize;
    const currentPage = +req.query.page;


    const definedStatus = {
        progress: "In progress",
        repaired: "Repaired",
        unrepaired: "Unrepaired",
        collected: true,
    };
    let _fetchedtransactions: any[];
    // console.log(limit_query)
    try {
        const customers: ICustomer[] = await Customer.find({
        }).select("_id").exec();
        const customer_Ids = customers.map((item) => item._id);

        if (transactionsPerPage && currentPage) {

            const transactions: ITransaction[] = await Transaction.find({ customerId: { $in: customer_Ids } })
                .sort("-transactionDate")
                .skip(transactionsPerPage * (currentPage - 1))
                .limit(transactionsPerPage).exec();

            const newCustomerIdss = transactions.map((item) => item.customerId);


            const cust = await Customer.find({ _id: { $in: newCustomerIdss } }).exec();

            const _fetchedtransactionsPlain: ICustomer[] = JSON.parse(JSON.stringify(transactions));
            const _customers: any[] = JSON.parse(JSON.stringify(cust));


            _fetchedtransactions = _fetchedtransactionsPlain.map((item) => {
                item["customerId"] = _customers.find((br) => br._id === item.customerId);
                return item;
            });

        } else {
            const transactions: ITransaction[] = await Transaction.find()
                .sort("transactionDate").exec()

            const newCustomerIdss = transactions.map((item) => item.customerId);

            const cust = await Customer.find({ _id: { $in: newCustomerIdss } }).exec();

            const _fetchedtransactionsPlain: ICustomer[] = JSON.parse(JSON.stringify(transactions));
            const _customers: any[] = JSON.parse(JSON.stringify(cust));

            _fetchedtransactions = _fetchedtransactionsPlain.map((item) => {
                item["customerId"] = _customers.find((br) => br._id === item.customerId);
                return item;
            });
        }
        const totalTransactions = await Transaction.countDocuments({ customerId: { $in: customer_Ids } }).exec();

        res.status(200).json({
            totalTransactions: totalTransactions,
            transactions: _fetchedtransactions,
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}




router.get("/transaction/:_id", adminCheck, getTransactionById);
async function getTransactionById(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
        const transaction: ITransaction = await Transaction.findById({
            _id: req.params._id
        }, { password: false }).exec()
        const customer_id = transaction.customerId;

        const customer: ICustomer = await Customer.findById({
            _id: customer_id
        }).exec();

        res.status(200).json({
            transaction,
            customer
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}
export default router;