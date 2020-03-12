import express from "express";
import adminCheck from "../../middleware/admin-check";


import Transaction, { ITransaction } from '../../model/transaction';
import Customer, { ICustomer } from "../../model/customer";
import User, { IUser } from '../../model/user';

const router = express.Router();

router.get("/customers", adminCheck, getCustomers)
async function getCustomers(req: express.Request, res: express.Response, next: express.NextFunction) {

    const customerPerPage = +req.query.pagesize;
    const currentPage = +req.query.page;

    let fetchedCustomers: ICustomer[];


    try {
        if (customerPerPage && currentPage) {
            fetchedCustomers = await Customer.find()
                .skip(customerPerPage * (currentPage - 1))
                .limit(customerPerPage)
                .sort("-createdAt")
                .exec();
        } else {
            fetchedCustomers = await Customer.find()
                .sort("-createdAt")
                .exec();
        }
        const totalCustomers: number = await Customer.countDocuments().exec();

        const customer_ids = fetchedCustomers.map((item) => item._id);
        const engineer_ids = fetchedCustomers.map((item) => item.engineer);

        const transactions: ITransaction[] = await Transaction.find({ customerId: { $in: customer_ids } }).exec();
        // const _fetchedCustomersPlain: ICustomer[] = JSON.parse(JSON.stringify(fetchedCustomers));
        const _transacts: any[] = JSON.parse(JSON.stringify(transactions));

        // const final_fetchedCustomers = _fetchedCustomersPlain.map((item) => {
        //     item["engineer"] = _engineer.find((br) => br._id === item.engineer);
        //     return item;
        // });

        const engineer: IUser[] = await User.find({ _id: { $in: engineer_ids } }, { password: false }).exec();

        const _fetchedCustomersPlain: ICustomer[] = JSON.parse(JSON.stringify(fetchedCustomers));
        const _engineer: any[] = JSON.parse(JSON.stringify(engineer));

        const final_fetchedCustomers = _fetchedCustomersPlain.map((item) => {
            // item["transactions"] = _transacts.find((br) => br._id === item.tr);
            item["engineer"] = _engineer.find((br) => br._id === item.engineer);
            // item["transactions"] = transactionsCount;
            return item;
        });


        // const spent = await Transaction.find({ customerId: customer_id })
        //     .select("advance").exec();
        // spent.forEach(d => {
        //     totalAmountSpent += d.advance
        // });

        res.status(200).json({
            allCustomers: final_fetchedCustomers,
            totalCustomers: totalCustomers
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}
// async function getCustomers(req: express.Request, res: express.Response, next: express.NextFunction) {

//     const customerPerPage = +req.query.pagesize;
//     const currentPage = +req.query.page;
//     let customerQuery = Customer.find();
//     let fetchedCustomers;


//     try {
//     if (customerPerPage && currentPage) {
//         customerQuery = Customer.find()
//             .skip(customerPerPage * (currentPage - 1))
//             .limit(customerPerPage);
//     }
//     customerQuery
//         .sort("-createdAt")
//         .then(documents => {
//             fetchedCustomers = documents;
//             return Customer.countDocuments();
//         }).then(count => {
//             res.status(200).json({
//                 message: "Customers fetched!!!",
//                 allCustomers: fetchedCustomers,
//                 totalCustomers: count
//             });
//         });
//         if (branchQuery) {
//             query = User.find({ branch: branchQuery, role: definedRoles.engineer, isVerified: true }, { password: false })
//         } else {
//             query = User.find({ role: definedRoles.engineer, isVerified: true }, { password: false })
//         }
//         const engineersCount = await User.countDocuments({ role: definedRoles.engineer, isVerified: true }).exec();

//         const fetchedEngineers = await query.sort("firstName").exec();
//         const branchIds = fetchedEngineers.map((item) => item.branch);

//         const branch = await Branch.find({ _id: { $in: branchIds } }).exec();

//         const _fetchedEngineersPlain: IUser[] = JSON.parse(JSON.stringify(fetchedEngineers));
//         const _branch: any[] = JSON.parse(JSON.stringify(branch));

//         const _fetchedEngineers = _fetchedEngineersPlain.map((item) => {
//             item["branch"] = _branch.find((br) => br._id === item.branch);
//             return item;
//         });

//         res.status(200).json({
//             message: "Engineers fetched!!!",
//             allEngineers: _fetchedEngineers,
//             totalEngineers: engineersCount
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Something went wrong!"
//         });
//     }

// }




// Getting one engineer for details pages
router.get("/customer/:_id", adminCheck, getCustomerById);
async function getCustomerById(req: express.Request, res: express.Response, next: express.NextFunction) {
    const limitParam = +req.query.limit;
    const param_id = req.params._id

    let transactions: ITransaction[];
    let totalAmountSpent: number = 0;


    const definedDevices = {
        android: "Android",
        ios: "IOS",
        pc: "Pc",
        electronics: "Electronics",
        windows_phone: "Windows phone",
        others: "Others",
    };


    let androids: number;
    let computers: number;
    let ios: number;
    let electronics: number;
    let windows_phone: number;
    let others: number;


    try {
        const customer: ICustomer = await Customer.findById({
            _id: param_id
        }).exec()

        const customer_id = customer._id;
        const engineer_id = customer.engineer;
        if (!customer_id) {
            return res.status(401).json({
                message: "Username already existing"
            });
        }

        const engineer: IUser = await User.findById({
            _id: engineer_id
        }, { password: false }).exec();

        if (limitParam) {
            transactions = await Transaction.find({ customerId: customer_id })
                .sort("-transactionDate")
                .limit(limitParam).exec();
        } else {
            transactions = await Transaction.find({ customerId: customer_id })
                .sort("-transactionDate").exec();
        }

        const totalTransactions: number = await Transaction.countDocuments({ customerId: customer_id }).exec();

        const spent: ITransaction[] = await Transaction.find({ customerId: customer_id })
            .select("advance").exec();
        spent.forEach(money => {
            totalAmountSpent += money.advance
        });

        androids = await Transaction.countDocuments({
            deviceType: definedDevices.android,
            customerId: { $in: customer_id }
        }).exec();

        computers = await Transaction.countDocuments({
            deviceType: definedDevices.pc,
            customerId: { $in: customer_id }
        }).exec();

        ios = await Transaction.countDocuments({
            deviceType: definedDevices.ios,
            customerId: { $in: customer_id }
        }).exec();

        electronics = await Transaction.countDocuments({
            deviceType: definedDevices.electronics,
            customerId: { $in: customer_id }
        }).exec();

        windows_phone = await Transaction.countDocuments({
            deviceType: definedDevices.windows_phone,
            customerId: { $in: customer_id }
        }).exec();

        others = await Transaction.countDocuments({
            deviceType: definedDevices.others,
            customerId: { $in: customer_id }
        }).exec();

        res.status(200).json({
            customer,
            engineer: {
                _id: engineer._id,
                firstName: engineer.firstName,
                lastName: engineer.lastName,
                userName: engineer.userName
            },
            transaction: {
                totalTransactions: totalTransactions,
                totalAmountSpent: totalAmountSpent,
                transactions: transactions,
                dataVisual: {
                    totalComputers: {
                        'name': 'Computers',
                        'value': computers
                    },
                    totalAndroids: {
                        'name': 'Android',
                        'value': androids
                    },
                    totalIos: {
                        'name': 'IOS',
                        'value': ios
                    },
                    totalElectronics: {
                        'name': 'Electronics',
                        'value': electronics
                    },
                    totalWindowsPhone: {
                        'name': 'Windows phone',
                        'value': windows_phone
                    },
                    totalOthers: {
                        'name': 'Others',
                        'value': others
                    }
                }

            }
        });


    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}


export default router;
