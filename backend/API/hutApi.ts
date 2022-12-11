import express, { Router } from "express";
import { checkSchema, validationResult } from 'express-validator';
import { hutList, hutByID } from "../DAO/hutDao";
import { bigCheck, isLoggedIn } from "./authApi";
import { User } from "@prisma/client";
import { editHike, hikeById } from "../DAO/hikeDao";

export const hutRouter = Router();

//Get all huts
hutRouter.get("", checkSchema({
  name: {
    in: ['query'],
    optional: true,
    isString: true
  },
  description: {
    in: ['query'],
    optional: true,
    isString: true
  },
  altitude: {
    in: ['query'],
    optional: true,
    isFloat: true
  },
  beds: {
    in: ['query'],
    optional: true,
    isInt: true
  },
  phone: {
    in: ['query'],
    optional: true,
    isString: true
  },
  email: {
    in: ['query'],
    optional: true,
    isString: true
  },
  website: {
    in: ['query'],
    optional: true,
    isString: true
  },

}), bigCheck(["guide", "hworker", "manager", "hiker"]), async (req: express.Request, res: express.Response) => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });

  try {
    const huts = await hutList();
    if (!huts) return res.status(404).json({ error: "Hut not found" });
    //add some check 
    return res.status(200).json(huts);
  } catch (error) {
    return res.status(500).json({ error: "Server Error: " + error });
  }

})

//Get hut by id
//is necessary the login? 
//..Could be i guess
hutRouter.get("/:id", bigCheck(["guide", "hworker", "manager", "hiker"]), async (req: express.Request, res: express.Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const hut = await hutByID(id);
    if (!hut) return res.status(404).json({ error: "Hut not found" });
    return res.status(200).json(hut);
  } catch (error) {
    return res.status(500).json({ error: "Server Error: " + error });
  }
})

//Modify hike's conditions
hutRouter.put("/:hikeid", bigCheck(["hworker"]), checkSchema({
  conditions: {
    in: ['body'],
    notEmpty: true,
  },
  conddescription: {
    in: ['body'],
    optional: true,
    notEmpty: true,
  },
  hikeid: {
    in: ['params'],
    isInt: true,
  }
}), async (req: express.Request, res: express.Response) =>{
  if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
  try {
    const hutid = (req.user as User).hutid;
    if(!hutid) return res.status(404).json({ error: "No hut assigned" });
    const hut = await hutByID(hutid);
    if (!hut) return res.status(404).json({ error: "Hut not found" });
    const id = parseInt(req.params.hikeid, 10);
    if(!(hut.hikes.find((e) => e.id === id))) return res.status(404).json({ error: "Hike not linked to hut" });
    const hike = await hikeById(id);
    if (!hike) return res.status(404).json({ error: "hike not found" });
    const { conditions, conddescription } = req.body;
    const newH = await editHike(id, { conditions, conddescription });
    return res.status(200).json(newH);
  } catch (error) {
    return res.status(500).json({ error: "Server Error: " + error });
  }
} )