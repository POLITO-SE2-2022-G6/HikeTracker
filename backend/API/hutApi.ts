import express, { Router } from "express";
import { check, checkSchema, validationResult } from 'express-validator';
import { hutList, hutByID } from "../DAO/hutDao";
import { isGuide, isLoggedIn } from "./authApi";
import { User } from "@prisma/client";

export const hutRouter = Router();

//if is necessary you can complete 
hutRouter.get("", /*checkSchema({
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
    
  }*/, async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });

    const hut_list = hutList();
    
    //add some check 
    return res.status(200).json(hut_list);
  
    /*if you want to filter huts
    const { name, description, altitude, beds, phone, email, website } = req.query as Record<string, string | undefined>;
    */
  })
  
  //Get hut by id
  //is necessary the login? 
  hutRouter.get("/:id", isLoggedIn, async (req: express.Request, res: express.Response) => { 
    const id = parseInt(req.params.id, 10);
    const hut = await hutByID(id);
    if (!hut) return res.status(404).json({ error: "Hut not found" });
    return res.status(200).json(hut);
  })