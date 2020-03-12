import express from 'express';
import Customer, { ICustomer } from '../model/customer';
import authCheck from '../middleware/auth-check';

const router = express.Router();



// getting  amount to be paid by a customer
router.get('/income', (req, res, next) => {

    let fetchedIncome;

    Customer.find()
        .select('amount')
        .then(documents => {
            if (documents) {
                res.status(200).json({
                    message: 'amount fetched!!!',
                    totalAmountIncome: documents
                });
                console.log(documents)
            } else {
                res.status(404).json({ message: "can't find device!" });
            }
        })
});


router.get('/amount', (req, res, next) => {
    Customer.find()
        .select('amount')
        .then(result => {
            let totalAmount = 0;
            result.forEach(d => {
                totalAmount += d.amount;
                // totalAmount = totalAmount + d.amount;
                console.log("====inside====")
                console.log(totalAmount);
            });
            console.log("====Amount====")
            console.log(totalAmount);


            res.json({
                message: 'Amount fetched!!!',
                amounts: totalAmount
            })
        });

});


router.get('/advance', (req, res, next) => {
    Customer.find()
        .select('advancePaid')
        .then(result => {
            let totalAmount: number = 0;
            result.forEach(d => {
                totalAmount += d.advancePaid
                // totalAmount = totalAmount + d.amount;
            });
            console.log("====Advance====")
            console.log(totalAmount);
            res.json({
                message: 'Advances found!!!',
                advanceAmount: totalAmount
            })
        });

});




export default router;