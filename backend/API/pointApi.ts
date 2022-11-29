import express, { Router } from "express";
import { checkSchema, validationResult } from 'express-validator';
import { isGuide, isGuideOrHiker } from "./authApi";
import { createPoint, editPoint, pointById, fullList } from "../DAO/pointDao";

export const pRouter = Router();

function checkSchemaOfPoint(){
    return checkSchema({
        label: {
            in: ['body'],
            optional: true,
            notEmpty: true
        },
        latitude: {
            in: ['body'],
            optional: true,
            isFloat: true
        },
        longitude: {
            in: ['body'],
            optional: true,
            isFloat: true
        },
        elevation: {
            in: ['body'],
            optional: true,
            isFloat: true
        },
        city: {
            in: ['body'],
            optional: true,
            notEmpty: true
        },
        region: {
            in: ['body'],
            optional: true,
            notEmpty: true
        },
        province: {
            in: ['body'],
            optional: true,
            notEmpty: true
        },
        hut:{
            in: ['body'],
            optional: true,
            isObject: true
        },
        "hut.description": {
            in: ['body'],
            optional: true,
            notEmpty: true
        },
        parkinglot:{
            in: ['body'],
            optional: true,
            isObject: true
        },
        "parkinglot.description": {
            in: ['body'],
            optional: true,
            notEmpty: true
        }
    })
}

//Get point from id
pRouter.get("/:id", checkSchema({
    id: {
        in: ['params'],
        isInt: true
    }
}), isGuide, async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    const id = parseInt(req.params.id);
    const point = await pointById(id);
    if (!point) return res.status(404).json({ error: "Point not found" });
    res.send(point);
});

//Edit Point
pRouter.put("/:id", checkSchemaOfPoint(), checkSchema({
    id: {
        in: ['params'],
        isInt: true
    }
}), isGuide, async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) 
        return res.status(400).json({ errors: "Illegal Data" });
    const id = parseInt(req.params.id);
    const point = await editPoint(id, req.body);
    if (!point) return res.status(404).json({ error: "Point not found" });
    res.send(point);
});

//New Point in Body
pRouter.post("", checkSchemaOfPoint(), isGuide, async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    const point = await createPoint(req.body);
    res.send(point);
});

//Get all points
pRouter.get("", isGuideOrHiker, checkSchema({
    hut:{
        in: ['query'],
        optional: true
    },
    hutdescription: {
        in: ['query'],
        optional: true,
        notEmpty: true
    },
    parkinglot:{
        in: ['query'],
        optional: true,
        isObject: true
    },
    parkinglotdescription: {
        in: ['query'],
        optional: true,
        notEmpty: true
    }
}), async (req: express.Request, res: express.Response) => {    
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    const {label, latitude, longitude, elevation, city, region, province, hut, hutdescription, parkinglot, parkinglotdescription } = req.query as Record<string, string | undefined>;
    
    res.send(await fullList({
        label,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        elevation: elevation ? parseFloat(elevation) : undefined,
        city,
        region,
        province,
        hut: hut? hut === "true" : undefined,
        hutdescription,
        parkinglot: parkinglot? parkinglot === "true" : undefined,
        parkinglotdescription
    }));
});
