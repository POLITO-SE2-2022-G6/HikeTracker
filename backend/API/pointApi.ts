import express, { Router } from "express";
import { checkSchema, validationResult } from 'express-validator';
import { bigCheck } from "./authApi";
import { createPoint, editPoint, pointById, fullList, deletePoint } from "../DAO/pointDao";

import path from "path";

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
            notEmpty: true
        },            
        parkinglot: {
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
        req.body.hut = req.body.hut && JSON.parse(req.body.hut);
        req.body.parkinglot = req.body.parkinglot && JSON.parse(req.body.parkinglot);

        const point = await editPoint(id, {
            label: req.body.label,
            latitude: req.body.latitude && parseFloat(req.body.latitude),
            longitude: req.body.longitude && parseFloat(req.body.longitude),
            elevation: req.body.elevation && parseFloat(req.body.elevation),
            city: req.body.city,
            region: req.body.region,
            province: req.body.province,
            hut: req.body.hut && {
                phone: req.body.hut.phone,
                email: req.body.hut.email,
                website: req.body.hut.website,
                beds: req.body.hut.beds && parseInt(req.body.hut.beds),
                altitude: req.body.hut.altitude && parseFloat(req.body.hut.altitude),
                description: req.body.hut.description
            },
            parkinglot: req.body.parkinglot && {
                description: req.body.parkinglot.description,
                capacity: req.body.parkinglot.capacity && parseInt(req.body.parkinglot.capacity)
            }
        });
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
        req.body.hut = req.body.hut ? JSON.parse(req.body.hut) : undefined;
        req.body.parkinglot = req.body.parkinglot ? JSON.parse(req.body.parkinglot) : undefined;

        const image = await imageUpload(req, res)
        if (typeof image !== "string" && image !== undefined) return res.status(400).json({ errors: [{ msg: "Invalid Image" }] });

        const point = await createPoint({
            label: req.body.label,
            latitude: req.body.latitude && parseFloat(req.body.latitude),
            longitude: req.body.longitude && parseFloat(req.body.longitude),
            elevation: req.body.elevation && parseFloat(req.body.elevation),
            city: req.body.city,
            region: req.body.region,
            province: req.body.province,
            hut: req.body.hut && {
                phone: req.body.hut.phone,
                email: req.body.hut.email,
                website: req.body.hut.website,
                beds: req.body.hut.beds && parseInt(req.body.hut.beds),
                altitude: req.body.hut.altitude && parseFloat(req.body.hut.altitude),
                description: req.body.hut.description || '',
                image: image || ''
            },
            parkinglot: req.body.parkinglot && {
                description: req.body.parkinglot.description,
                capacity: req.body.parkinglot.capacity && parseInt(req.body.parkinglot.capacity)
            }
        });
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

async function imageUpload(req: express.Request, res: express.Response) {
    let file = undefined
    try {
      if (req.files) {
        const image = req.files.image
        if (!(image instanceof Array)) {
          const rand = (Math.random() + 1).toString(36).substring(7)
          const trackPath = path.join(path.resolve(__dirname, '..'), 'images', rand, image.name);
          image.mv(trackPath, (err) => {
            if (err) return res.status(500);
          });
          file = `api/images/${rand}/${image.name}`;
        }
      }
      return file;
    } catch (e) {
      return res.status(500);
    }
  }