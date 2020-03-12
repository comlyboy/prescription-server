import express from 'express';
import Customer, { ICustomer } from '../model/customer';
import authCheck from '../middleware/auth-check';

const router = express.Router();

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


// getting repaired Status
router.get("/works/repaired", authCheck, (req, res, next) => {
    Customer.find({
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

            } else {
                res.status(404).json({ message: "can't find repaired Devices!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Something went wrong!"
            });
        });
});

async function getAllJobs(req: express.Request, res: express.Response, next: express.NextFunction) {
    const definedStatus = {
        progress: "In progress",
        repaired: "Repaired",
        unrepaired: "Unrepaired",
        collected: true,
    };

    try {
        const totalCustomers = await Customer.find()
            .countDocuments().exec();

        const repaired = await Customer.find({
            status: definedStatus.repaired, isCollected: !definedStatus.collected
        }).sort("-createdAt")
            .limit(6).exec();

        const progress = await Customer.find({
            status: definedStatus.progress
        }).sort("-createdAt")
            .limit(6).exec();

        const unrepaired = await Customer.find({
            status: definedStatus.unrepaired
        }).sort("-createdAt")
            .limit(6).exec();

        const collected = await Customer.find({
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

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }

}


// getting in-progress Status
router.get("/works/progress", authCheck, (req, res, next) => {
    Customer.find({ status: "In progress", engineer: req["userData"].userId })
        .sort("-createdAt")
        .limit(7)
        .then(documents => {
            if (documents) {
                res.status(200).json({
                    message: "Customers fetched!!!",
                    allInProgress: documents
                });

            } else {
                res.status(404).json({ message: "can't find status!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Something went wrong!"
            });
        });
});


// getting unrepaired Status
router.get("/works/unrepaired", authCheck, (req, res, next) => {
    Customer.find({ status: "Unrepaired", engineer: req["userData"].userId })
        .sort("-createdAt")
        .limit(7)
        .then(documents => {
            if (documents) {
                res.status(200).json({
                    message: "Repaired devices fetched!!!",
                    allUnrepaired: documents
                });

            } else {
                res.status(404).json({ message: "can't find unrepaired Devices!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Something went wrong!"
            });
        });
});


// getting unrepaired Status
router.get("/works/delivered", authCheck, (req, res, next) => {
    Customer.find({ isCollected: true, engineer: req["userData"].userId })
        .sort("-createdAt")
        .limit(7)
        .then(documents => {
            if (documents) {
                res.status(200).json({
                    message: "Repaired devices fetched!!!",
                    allDelivered: documents
                });

            } else {
                res.status(404).json({ message: "can't find delivered Devices!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Something went wrong!"
            });
        });
});





// **************************************************

router.put("/works/update/repaired/:_id", (req, res, next) => {
    Customer.updateOne(
        {
            _id: req.params._id
        },
        {
            $set: {
                status: "Repaired"
            }
        })
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: "Successfull!" });
            } else {
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
    Customer.updateOne(
        {
            _id: req.params._id
        },
        {
            $set: {
                status: "In progress"
            }
        })
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: "Successfull!" });
            } else {
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
    console.log(req.params._id)
    Customer.updateOne(
        {
            _id: req.params._id
        },
        {
            $set: {
                isCollected: true
            }
        })
        .then(result => {
            if (result.n > 0) {
                console.log(result)
                res.status(200).json({ message: "Successfull!" });
            } else {

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
    console.log(req.params._id)
    Customer.updateOne(
        {
            _id: req.params._id
        },
        {
            $set: {
                status: "Unrepaired"
            }
        })
        .then(result => {
            if (result.n > 0) {
                console.log(result)
                res.status(200).json({ message: "Successfull!!!" });
            } else {

                res.status(401).json({ message: "Not successfull!!!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Something went wrong!"
            });
        });
});


export default router;