// this file checks for user token presence and if it's valid credentials
// is meant to protect all route from not logged user

import jwt from 'jsonwebtoken';
import express from 'express';

import User from '../model/user';


export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const authorization = req.headers.authorization || "";
        const token = authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'is_a_secret_dont_tell_anybody');
        req["userData"] = { userName: decodedToken.userName, userId: decodedToken.userId };

        const user = await User.findById({ _id: decodedToken.userId })
            .select('role').exec();
        
        if (user.role !== 'admin') {
            return res.status(401).json({
                message: 'You are not an admin!!!'
            });
        }

        next();
    } catch (error) {
        res.status(401).json({
            message: "You are not logged in!!!"
        })
    }
};