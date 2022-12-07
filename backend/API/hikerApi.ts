import express, { Router } from "express";
import { checkSchema, validationResult } from 'express-validator';
import { isGuideOrHiker } from "./authApi";
import { hikesList } from "../DAO/hikeDao";
import { createPerformance,editPerformance,performanceByHikerId } from "../DAO/hikerDao";
import { User,Performance } from "@prisma/client";

export const uRouter = Router();

uRouter.post("/performance",isGuideOrHiker,checkSchema({
    length:{
        in: ['body'],
        isFloat: true

    },
    duration:{
        in: ['body'],
        isInt:true

    },
    altitude:{
        in: ['body'],
        isFloat:true

    },
    difficulty:{
        in: ['body'],
        isInt:true

    }
}),async(req:express.Request,res:express.Response)=> {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
    console.log("pre-chiamata");
    
  const performance = await createPerformance({
    length:req.body.length && parseFloat(req.body.length),
    duration:req.body.duration &&parseInt(req.body.duration),
    altitude:req.body.altitude && parseFloat(req.body.altitude),
    difficulty:req.body.difficulty && parseInt(req.body.difficulty),
    hikerid: (req.user as User).id
    
  });

  console.log("perfomance creata");
  return res.status(201).json(performance);
}
)

//edit performance
uRouter.put("/performance",isGuideOrHiker,checkSchema({
    length:{
        in: ['body'],
        isFloat: true

    },
    duration:{
        in: ['body'],
        isInt:true

    },
    altitude:{
        in: ['body'],
        isFloat:true

    },
    difficulty:{
        in: ['body'],
        isInt:true

    }

}),async(req:express.Request,res:express.Response)=>{
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
    const hikerId=(req.user as User).id
    const modifiedPerformance= await editPerformance(hikerId,{
    length:req.body.length && parseFloat(req.body.length),
    duration:req.body.duration &&parseInt(req.body.duration),
    altitude:req.body.altitude && parseFloat(req.body.altitude),
    difficulty:req.body.difficulty && parseInt(req.body.difficulty),
    })
}
)

uRouter.get("/performance",isGuideOrHiker,async (req: express.Request, res: express.Response) => {
    const hikerId=(req.user as User).id
    const performance = await (performanceByHikerId(hikerId));
    if (!performance) return res.status(404).json({ error: "Performance not found" });
    return res.status(200).json(performance);
  })


uRouter.get("/hikesByPerf",isGuideOrHiker,async(req:express.Request,res:express.Response)=>{
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
    const hikerId=(req.user as User).id
    const performance=await (performanceByHikerId(hikerId));
    res.send(await hikesList(
        {
            difficulty:performance?.difficulty,
            length:performance?.length,
            expected_time:performance?.duration,
            ascent:performance?.altitude
        }));
    
    })
  