import express, { Router } from "express";
import { checkSchema, validationResult } from 'express-validator';
import { isGuide, isGuideOrHiker } from "./authApi";
import { createPoint, editPoint, pointById, fullList } from "../DAO/pointDao";

export const pRouter = Router();

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
pRouter.put("/:id", checkSchema({
    id: {
        in: ['params'],
        isInt: true
    },
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
}), isGuide, async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) 
        return res.status(400).json({ errors: "Illegal Data" });
    const id = parseInt(req.params.id);
    const point = await editPoint(id, req.body);
    if (!point) return res.status(404).json({ error: "Point not found" });
    res.send(point);
});

//New Point in Body
pRouter.post("", checkSchema({
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
}), isGuide, async (req: express.Request, res: express.Response) => {
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
    "hut.description": {
        in: ['query'],
        optional: true,
        notEmpty: true
    },
    parkinglot:{
        in: ['query'],
        optional: true,
        isObject: true
    }
}), async (req: express.Request, res: express.Response) => {    
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    const points = await fullList(req.query);
    res.send(points);
});
