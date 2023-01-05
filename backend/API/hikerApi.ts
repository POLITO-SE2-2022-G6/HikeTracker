import express, { Router } from "express";
import { checkSchema, validationResult } from 'express-validator';
import { bigCheck } from "./authApi";
import { hikesList } from "../DAO/hikeDao";
import { assignHike, deletePerformance, editPerformance, getHike, getPerformance, hikesListByUser, modifyHike } from "../DAO/hikerDao";
import { User } from "@prisma/client";

export const uRouter = Router();

//edit performance
uRouter.put("/performance", bigCheck(["hiker"]),checkSchema({
    length:{
        in: ['body'],
        isFloat: true,
        optional: true
    },
    duration: {
        in: ['body'],
        isInt: true,
        optional: true
    },
    altitude: {
        in: ['body'],
        isFloat: true,
        optional: true
    },
    difficulty: {
        in: ['body'],
        isInt: true,
        optional: true
    }

}), async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
    const hikerId = (req.user as User).id;
    try {
        const modifiedPerformance = await editPerformance(hikerId, {
            length: req.body.length && parseFloat(req.body.length),
            duration: req.body.duration && parseInt(req.body.duration),
            altitude: req.body.altitude && parseFloat(req.body.altitude),
            difficulty: req.body.difficulty && parseInt(req.body.difficulty),
        })
        return res.status(201).json(modifiedPerformance);
    } catch (e) {
        return res.status(500).json({ error: "Internal Server Error: " + e });
    }
})

//get performance
uRouter.get("/performance", bigCheck(["hiker"]), async (req: express.Request, res: express.Response) => {
    const hikerId=(req.user as User).id;
    const performance = await (getPerformance(hikerId));
    if (!performance) return res.status(404).json({ error: "Performance not found" });
    return res.status(200).json(performance);
  })
  

uRouter.get("/hikesByPerf", bigCheck(["hiker"]), async(req:express.Request,res:express.Response)=>{
    const hikerId=(req.user as User).id;
    const performance = await (getPerformance(hikerId));
    if (!performance) return res.status(404).json({ error: "Performance not found" });
    res.send(await hikesList(
        {
            difficulty:performance?.difficulty,
            length:performance?.length,
            expected_time:performance?.duration,
            ascent:performance?.altitude
        }));
    
    })
  

//delete performance
uRouter.delete("/performance", bigCheck(["hiker"]), async (req: express.Request, res: express.Response) => {
    try {
        const hikerId = (req.user as User).id;
        await deletePerformance(hikerId);
        return res.status(204).json({ message: "Performance deleted" });
    } catch (e) {
        return res.status(500).json({ error: "Internal Server Error: " + e });
    }
})

//assign hike to hiker (activity)
uRouter.post("/hike/:id", bigCheck(["hiker"]), checkSchema({
    id: {
        in: ['params'],
        isInt: true
    },
    refPointId: {
        in: ['body'],
        isInt: true
    }
}), async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
    try {
        const hikerId = (req.user as User).id;
        const hikeId = parseInt(req.params.id);
        const refPointId = req.body.refPointId;
        if ((await hikesListByUser(hikerId, "ongoing")).length !== 0) return res.status(400).json({ error: "You already have an ongoing hike" });
        const hike = await assignHike(hikerId, hikeId, refPointId);
        return res.status(201).json(hike);
    } catch (e) {
        return res.status(500).json({ error: "Internal Server Error: " + e });
    }
})

//modify activity
uRouter.put("/hike/:id", bigCheck(["hiker"]), checkSchema({
    id: {
        in: ['params'],
        isInt: true
    },
    status: {
        in: ['body'],
        optional: true,
        notEmpty: true
    },
    refPointId: {
        in: ['body'],
        optional: true,
        isInt: true
    }
}), async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
    try {
        const hike = await modifyHike(parseInt(req.params.id), req.body.status ? req.body.status : undefined, req.body.refPointId ? parseInt(req.body.refPointId) : undefined);
        return res.status(201).json(hike);
    } catch (e) {
        return res.status(500).json({ error: "Internal Server Error: " + e });
    }
})

//get activity
uRouter.get("/hike/:id", bigCheck(["hiker"]), checkSchema({
    id: {
        in: ['params'],
        isInt: true
    }
}), async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
    try {
        const hike = await getHike(parseInt(req.params.id));
        const newHike= hike && {
            "hike.reference_points": hike.refPoint ? hike.hike.reference_points.splice(0, hike.hike.reference_points.indexOf(hike.refPoint)) : hike.hike.reference_points,
        }
        return res.status(201).json(newHike);
    } catch (e) {
        return res.status(500).json({ error: "Internal Server Error: " + e });
    }
})

//get list of activities
uRouter.get("/hikes", bigCheck(["hiker"]), checkSchema({
    completed: {
        in: ['query'],
        optional: true,
        isBoolean: true
    }
}), async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
    try { 
        const { completed } = req.query as Record<string, string | undefined>;
        console.log((req.user as User).id + "" + ( completed ? "completed" : undefined))
        const hikes = await hikesListByUser((req.user as User).id, completed ? "completed" : undefined);
        return res.status(201).json(hikes);
    } catch (e) {
        return res.status(500).json({ error: "Internal Server Error: " + e });
    }
})