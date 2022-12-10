import express, { Router } from "express";
import { checkSchema, validationResult } from 'express-validator';
import { isManager } from "./authApi";
import {validateGuide,uGuidesList} from "../DAO/managerDao";
import { User,Performance } from "@prisma/client";

export const mRouter = Router();
//validate local guide
mRouter.put("/validate/:id",isManager,async(req:express.Request,res:express.Response)=>{
    const id: number = parseInt(req.params.id, 10);
    const validatedGuide= await validateGuide(id);
    return res.status(201).json(validatedGuide);
})

mRouter.get("",isManager,async(req:express.Request,res:express.Response)=>{
    const unverifiedGuides= await uGuidesList();
    return res.status(201).json(unverifiedGuides);
})