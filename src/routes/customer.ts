import express from "express";
import authCheck from "../middleware/auth-check";

import Customer, { ICustomer } from "../model/customer";
import Transaction from '../model/transaction';

import { getCustomerId } from "../helper/unique-id";

const router = express.Router();


router.post("/customers", authCheck, addCustomer);
async function addCustomer(req: express.Request, res: express.Response, next: express.NextFunction) {

  const customer_req_body: ICustomer = req.body;

  let customerId = getCustomerId(10);

  const customer = new Customer({
    firstName: customer_req_body.firstName,
    lastName: customer_req_body.lastName,
    phoneNumber: customer_req_body.phoneNumber,
    engineer: req["userData"].userId,
    customerId: customerId,
  });

  try {
    const result: ICustomer = await customer.save();

    res.status(201).json({
      customerId: result._id
    });

  } catch (error) {
    res.status(500).json({
      message: "Somethiing went wrong!"
    });
  }

}



// Getting customers from database
router.get("/customers", authCheck, getCustomers);
async function getCustomers(req: express.Request, res: express.Response, next: express.NextFunction) {

  const limitQuery = +req.query.limit;
  const searchQuery = req.query.search;

  let customers: ICustomer[];

  try {
    if (limitQuery) {
      customers = await Customer.find({
        engineer: req["userData"].userId
      })
        .limit(limitQuery)
        .sort("-createdAt")
        .exec();
    } else {
      customers = await Customer.find({
        engineer: req["userData"].userId
      })
        .sort("-createdAt")
        .exec();
    }

    const totalCustomers: number = await Customer.countDocuments({ engineer: req["userData"].userId })

    res.status(200).json({
      customers: customers,
      totalCustomers: totalCustomers
    });


  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!"
    });
  }


}


// Getting one customer for editing and details pages
router.get("/customer/:_id", authCheck, getCustomerById);
async function getCustomerById(req: express.Request, res: express.Response, next: express.NextFunction) {

  try {
    const customer: ICustomer = await Customer.findById({
      _id: req.params._id,
      engineer: req["userData"].userId
    })

    const transactions = await Transaction.find({
      customerId: customer._id
    })

    res.status(200).json({
      customer: customer,
      transactions: transactions
    });

  } catch (error) {
    res.status(500).json({
      message: "Somethiing went wrong!"
    });
  }
}



// Deleting a customer
router.delete("/customers/:_id", authCheck, deleteCustomer);
async function deleteCustomer(req: express.Request, res: express.Response, next: express.NextFunction) {

  try {
    await Customer.deleteOne({
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


router.put("/customers/:_id", authCheck, updateCustomer)
async function updateCustomer(req: express.Request, res: express.Response, next: express.NextFunction) {
  const customer_req_body: ICustomer = req.body;

  try {
    const customer_in_db: ICustomer = await Customer.findById({
      _id: req.params._id,
      engineer: req["userData"].userId
    }).exec();

    if (customer_in_db) {
      const custRealObj = JSON.parse(JSON.stringify(customer_in_db));

      // assigning the edited inputs to the customer object
      const customer = Object.assign({}, custRealObj, {
        firstName: customer_req_body.firstName,
        lastName: customer_req_body.lastName,
        phoneNumber: customer_req_body.phoneNumber
      });

      const result = await Customer.updateOne(
        { _id: req.params._id, engineer: req["userData"].userId },
        customer
      )

      if (result.nModified > 0) {
        res.status(200).json({ message: "Updated successfully!" });
      } else {
        res.status(401).json({ message: "You are not authorised!" });
      }

    } else {
      res.status(404).json({ message: "Customer does not exist!" });
    }

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!"
    });
  }

}

// Getting one customer for editing and details pages
router.get("/customer/find/:phone_number", authCheck, getCustomerByPhoneNumber);
async function getCustomerByPhoneNumber(req: express.Request, res: express.Response, next: express.NextFunction) {

  try {
    const customer: ICustomer = await Customer.findOne({
      phoneNumber: req.params.phone_number,
      engineer: req["userData"].userId
    })

    res.status(200).json(customer);

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!"
    });
  }
}


export default router;