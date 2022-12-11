import express, { Router } from "express";
import { checkSchema, validationResult } from 'express-validator';
import { hutList, hutByID } from "../DAO/hutDao";
import { bigCheck, isLoggedIn } from "./authApi";
import { User } from "@prisma/client";

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

    const huts = await hutList();
    
    if (!huts) return res.status(404).json({ error: "Hut not found" });
    //add some check 
    return res.status(200).json(huts);
  })
  
  //Get hut by id
  //is necessary the login? 
  //..Could be i guess
  hutRouter.get("/:id", bigCheck(["guide", "hworker", "manager", "hiker"]), async (req: express.Request, res: express.Response) => { 
    const id = parseInt(req.params.id, 10);
    const hut = await hutByID(id);
    if (!hut) return res.status(404).json({ error: "Hut not found" });
    return res.status(200).json(hut);
  })