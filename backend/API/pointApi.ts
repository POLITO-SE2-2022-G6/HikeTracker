import express from "express";
import { Router } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { isGuide } from "./authApi";
import { createPoint, editPoint, pointById, fullList } from "../DAO/pointDao";
import { hRouter } from "./hikeApi";

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
    description: {
        in: ['body'],
        optional: true,
        notEmpty: true
    },
    hut: {
        in: ['body'],
        optional: true,
        isBoolean: true
    },
    parking_lot: {
        in: ['body'],
        optional: true,
        isBoolean: true
    }
}), isGuide, async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    const id = parseInt(req.params.id);
    const hike = await editPoint(id, req.body);
    if (!hike) return res.status(404).json({ error: "Hike not found" });
    res.send(hike);
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
    parking_lot:{
        in: ['body'],
        optional: true,
        isObject: true
    },
    "parking_lot.description": {
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
pRouter.get("", isGuide, checkSchema({
    hut:{
        in: ['query'],
        optional: true,
        isBoolean: true
    },
    parking_lot:{
        in: ['query'],
        optional: true,
        isBoolean: true
    }
}), async (req: express.Request, res: express.Response) => {
    const hike = await fullList(req.query);
    res.send(hike);
});
