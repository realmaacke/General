"use strict";
import { type Request, type Response, type NextFunction, raw } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";

const JWTSECRET = "ADDSECRETTOENV";

interface InitAuth {
    clientSecret: String,
    clientId: String,
};

interface AuthDetails {
    bearer: String
}


export const authGuard = async (req: Request<InitAuth | AuthDetails>, res: Response, next: NextFunction) => {

}

export const authIndex = async (req: Request<any>, res: Response, next: NextFunction) => {
}

interface authLoginDetails {
    username: String,
    password: String
}

export const authLogin = async (req: Request<authLoginDetails>, res: Response, next: NextFunction) => {
    try {
        const username = req.body.username ?? null;
        const password = req.body.password ?? null;

        if (!username || !password) {
            res.status(401).send({
                msg: "Invalid Credentials"
            });
        }

        // Check DB
        const user = { id: 123, role: 'user' };

        const token = jwt.sign(
            {
                sub: user.id,
                role: user.role
            },
            process.env.JWT_SECRET || JWTSECRET,
            {
                expiresIn: "1h"
            }
        );

        return token;

    } catch (error) {
        next(error);
    }
}

export const authRegister = async (req: Request<any>, res: Response, next: NextFunction) {

}