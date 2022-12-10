import express, { Router } from "express";
import { checkSchema, validationResult } from 'express-validator';
import { isGuideOrHiker, isHiker } from "./authApi";
import { hikesList } from "../DAO/hikeDao";
import { createPerformance,deletePerformance,editPerformance,getPerformance } from "../DAO/hikerDao";
import { User,Performance } from "@prisma/client";

export const uRouter = Router();

//Create new performance
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
    
  const performance = await createPerformance({
    length:req.body.length && parseFloat(req.body.length),
    duration:req.body.duration &&parseInt(req.body.duration),
    altitude:req.body.altitude && parseFloat(req.body.altitude),
    difficulty:req.body.difficulty && parseInt(req.body.difficulty),
    hikerid: (req.user as User).id
    
  });

  return res.status(201).json(performance);
}
)

//edit performance
uRouter.put("/performance",isGuideOrHiker,checkSchema({
    length:{
        in: ['body'],
        isFloat: true,
        optional:true
    },
    duration:{
        in: ['body'],
        isInt:true,
        optional:true
    },
    altitude:{
        in: ['body'],
        isFloat:true,
        optional:true
    },
    difficulty:{
        in: ['body'],
        isInt:true,
        optional:true
    }

}),async(req:express.Request,res:express.Response)=>{
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
    const performanceId=(req.user as User).performanceid;
    if (!performanceId) return res.status(404).json({ error: "No performance saved" });

    const modifiedPerformance= await editPerformance(performanceId,{
    length:req.body.length && parseFloat(req.body.length),
    duration:req.body.duration &&parseInt(req.body.duration),
    altitude:req.body.altitude && parseFloat(req.body.altitude),
    difficulty:req.body.difficulty && parseInt(req.body.difficulty),
    })
    return res.status(201).json(modifiedPerformance);
})

//get performance
uRouter.get("/performance",isGuideOrHiker,async (req: express.Request, res: express.Response) => {
    const performanceId=(req.user as User).performanceid;
    if (!performanceId) return res.status(404).json({ error: "No performance saved" });
    const performance = await (getPerformance(performanceId));
    if (!performance) return res.status(404).json({ error: "Performance not found" });
    return res.status(200).json(performance);
  })


uRouter.get("/hikesByPerf",isGuideOrHiker,async(req:express.Request,res:express.Response)=>{
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
    const performanceId=(req.user as User).performanceid;
    if (!performanceId) return res.status(404).json({ error: "No performance saved" });
    const performance = await (getPerformance(performanceId));
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
uRouter.delete("/performance", isHiker, async(req:express.Request,res:express.Response)=>{    
    const performanceId=(req.user as User).performanceid;
    if (!performanceId) return res.status(404).json({ error: "No performance saved" });
    await deletePerformance(performanceId);
    return res.status(200).json({message:"Performance deleted"});
})