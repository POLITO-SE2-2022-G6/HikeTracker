import express, { Router } from "express";
import { checkSchema, validationResult } from 'express-validator';
import { bigCheck } from "./authApi";
import { validateGuide, uGuidesList } from "../DAO/managerDao";

export const mRouter = Router();

//validate local guide
mRouter.put("/validate/:id", checkSchema({
    id: {
        in: ['params'],
        isInt: true,
    }
}), bigCheck(["manager"]), async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    try {
        const id: number = parseInt(req.params.id, 10);
        const validatedGuide = await validateGuide(id);
        return res.status(201).json(validatedGuide);
    } catch (e) {
        return res.status(500).json({ error: "Internal Server Error: " + e });
    }
})

mRouter.get("", bigCheck(["manager"]), async (req: express.Request, res: express.Response) => {
    try {
        const unverifiedGuides = await uGuidesList();
        return res.status(201).json(unverifiedGuides);
    } catch (e) {
        return res.status(500).json({ error: "Internal Server Error: " + e });
    }
})