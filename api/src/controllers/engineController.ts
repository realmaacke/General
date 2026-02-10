"use strict";
import { type Request, type Response, type NextFunction } from "express";

export const engineIndex = async (req: Request<any>, res: Response, next: NextFunction) => {
    res.status(200).json({
        msg: "You made it!"
    });
}