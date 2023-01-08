import express, { Router } from "express";
import { checkSchema, validationResult } from 'express-validator';
import { bigCheck } from "./authApi";
import { createPoint, editPoint, pointById, fullList, deletePoint } from "../DAO/pointDao";

export const pRouter = Router();

function checkSchemaOfPoint() {
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
        hut: {
            in: ['body'],
            optional: true,
            isObject: true
        },
        "hut.description": {
            in: ['body'],
            optional: true,
            notEmpty: true
        },
        parkinglot: {
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
}), bigCheck(["guide"]), async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    try {
        const id = parseInt(req.params.id);
        const point = await pointById(id);
        if (!point) return res.status(404).json({ error: "Point not found" });
        res.send(point);
    }
    catch (e) {
        return res.status(500).json({ error: "Server Error: " + e });
    }
});

//Edit Point
pRouter.put("/:id", checkSchemaOfPoint(), checkSchema({
    id: {
        in: ['params'],
        isInt: true
    }
}), bigCheck(["guide"]), async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty())
        return res.status(400).json({ errors: "Illegal Data" });
    try {
        const id = parseInt(req.params.id);
        const point = await editPoint(id, req.body);
        if (!point) return res.status(404).json({ error: "Point not found" });
        res.send(point);
    } catch (e) {
        return res.status(500).json({ error: "Server Error: " + e });
    }
});

//New Point in Body
pRouter.post("", checkSchemaOfPoint(), bigCheck(["guide"]), async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    try {
        const point = await createPoint(req.body);
        res.send(point);
    } catch (e) {
        return res.status(500).json({ error: "Server Error: " + e });
    }
});

//Get all points
pRouter.get("", bigCheck(["guide", "hiker"]), checkSchema({
    hutphone: {
        in: ['query'],
        optional: true,
        notEmpty: true
    },
    hutemail: {
        in: ['query'],
        optional: true,
        notEmpty: true
    },
    hutwebsite: {
        in: ['query'],
        optional: true,
        notEmpty: true
    },
    hutbeds: {
        in: ['query'],
        optional: true,
        isInt: true
    },
    hutaltitude: {
        in: ['query'],
        optional: true,
        isFloat: true
    },
    region: {
        in: ['query'],
        optional: true,
        notEmpty: true
    },
    hut: {
        in: ['query'],
        optional: true,
        isBoolean: true
    },
    hutdescription: {
        in: ['query'],
        optional: true,
        notEmpty: true
    },
    parkinglot: {
        in: ['query'],
        optional: true,
        isBoolean: true
    },
    parkinglotdescription: {
        in: ['query'],
        optional: true,
        notEmpty: true
    }
}), async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    const { label, latitude, longitude, elevation, city, region, province, hut, hutphone, hutemail,hutwebsite, hutbeds, hutaltitude, hutdescription, parkinglot, parkinglotdescription } = req.query as Record<string, string | undefined>;

    try {
        res.send(await fullList({
            label,
            latitude: latitude ? parseFloat(latitude) : undefined,
            longitude: longitude ? parseFloat(longitude) : undefined,
            elevation: elevation ? parseFloat(elevation) : undefined,
            city,
            region,
            province,
            hut: hut ? hut === "true" : undefined,
            hutdescription,
            hutphone,
            hutemail,
            hutwebsite,
            hutbeds: hutbeds ? parseInt(hutbeds) : undefined,
            hutaltitude: hutaltitude ? parseFloat(hutaltitude) : undefined,
            parkinglot: parkinglot ? parkinglot === "true" : undefined,
            parkinglotdescription
        }));

    } catch (error) {
        return res.status(500).json({ error: "Server Error: " + error });
    }
});

//Delete Point
pRouter.delete("/:id", checkSchema({
    id: {
        in: ['params'],
        isInt: true
    }
}), bigCheck(["guide"]), async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    try {
        const id = parseInt(req.params.id);
        await deletePoint(id);
        return res.status(204).send();
    } catch (e) {
        return res.status(500).json({ error: "Server Error: " + e });
    }
});