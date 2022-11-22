import express from "express";
import { Router } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { isGuide, isHiker } from "./authApi";
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
    const hike = await pointById(id);
    if (!hike) return res.status(404).json({ error: "Hike not found" });
    res.send(hike);
});

//Edit Point
pRouter.put("/:id", checkSchema({
    id: {
        in: ['params'],
        isInt: true
    },
    Label: {
        in: ['body'],
        optional: true,
        notEmpty: true
    },
    Latitude: {
        in: ['body'],
        optional: true,
        isFloat: true
    },
    Longitude: {
        in: ['body'],
        optional: true,
        isFloat: true
    },
    Elevation: {
        in: ['body'],
        optional: true,
        isFloat: true
    },
    City: {
        in: ['body'],
        optional: true,
        notEmpty: true
    },
    Region: {
        in: ['body'],
        optional: true,
        notEmpty: true
    },
    Province: {
        in: ['body'],
        optional: true,
        notEmpty: true
    },
    Hut:{
        in: ['body'],
        optional: true,
        isObject: true
    },
    "Hut.description": {
        in: ['body'],
        optional: true,
        notEmpty: true
    },
    Parking_lot:{
        in: ['body'],
        optional: true,
        isObject: true
    },
    "Parking_lot.description": {
        in: ['body'],
        optional: true,
        notEmpty: true
    }
}), isGuide, async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    const id = parseInt(req.params.id);
    const point = await editPoint(id, req.body);
    if (!point) return res.status(404).json({ error: "Hike not found" });
    res.send(point);
});

//New Point in Body
pRouter.post("", checkSchema({
    Label: {
        in: ['body'],
        optional: true,
        notEmpty: true
    },
    Latitude: {
        in: ['body'],
        optional: true,
        isFloat: true
    },
    Longitude: {
        in: ['body'],
        optional: true,
        isFloat: true
    },
    Elevation: {
        in: ['body'],
        optional: true,
        isFloat: true
    },
    City: {
        in: ['body'],
        optional: true,
        notEmpty: true
    },
    Region: {
        in: ['body'],
        optional: true,
        notEmpty: true
    },
    Province: {
        in: ['body'],
        optional: true,
        notEmpty: true
    },
    Hut:{
        in: ['body'],
        optional: true,
        isObject: true
    },
    "Hut.description": {
        in: ['body'],
        optional: true,
        notEmpty: true
    },
    Parking_lot:{
        in: ['body'],
        optional: true,
        isObject: true
    },
    "Parking_lot.description": {
        in: ['body'],
        optional: true,
        notEmpty: true
    }
}), isGuide, async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    const pont = await createPoint(req.body);
    res.send(pont);
});

//Get all points
pRouter.get("", isGuide || isHiker, checkSchema({
    Hut:{
        in: ['query'],
        optional: true,
        isBoolean: true
    },
    "Hut.description": {
        in: ['query'],
        optional: true,
        notEmpty: true
    },
    Parking_lot:{
        in: ['query'],
        optional: true,
        isBoolean: true
    }
}), async (req: express.Request, res: express.Response) => {
    const points = await fullList(req.query);
    res.send(points);
});
