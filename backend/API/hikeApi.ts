import express, { Router } from "express";
import path from "path";
import { checkSchema, validationResult } from 'express-validator';
import { createHike, deleteHike, editHike, hikeById, hikesList } from "../DAO/hikeDao";
import { bigCheck, isLoggedIn } from "./authApi";
import { User } from "@prisma/client";

export const hRouter = Router();

//HOME
hRouter.get("", checkSchema({
  city: {
    in: ['query'],
    optional: true,
    notEmpty: true
  },
  Pprovince: {
    in: ['query'],
    optional: true,
    notEmpty: true
  },
  region: {
    in: ['query'],
    optional: true,
    notEmpty: true
  },
  difficulty: {
    in: ['query'],
    optional: true,
    isInt: true
  },
  length: {
    in: ['query'],
    optional: true,
    isFloat: true
  },
  ascent: {
    in: ['query'],
    optional: true,
    isFloat: true
  },
  expected_time: {
    in: ['query'],
    optional: true,
    isInt: true
  }
}), async (req: express.Request, res: express.Response) => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });

  const { city, province, region, difficulty, length, ascent, expected_time } = req.query as Record<string, string | undefined>;
  try {
    res.send(await hikesList({
      difficulty: difficulty ? parseInt(difficulty) : undefined,
      city,
      province,
      region,
      length: length ? parseFloat(length) : undefined,
      ascent: ascent ? parseFloat(ascent) : undefined,
      expected_time: expected_time ? parseFloat(expected_time) : undefined
    }));
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error: " + e });
  }
})

//Get hike by id
hRouter.get("/:id", isLoggedIn, async (req: express.Request, res: express.Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const hike = await hikeById(id);
    if (!hike) return res.status(404).json({ error: "Hike not found" });
    return res.status(200).json(hike);
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error: " + e });
  }
})


//New Hike in Body
hRouter.post("", bigCheck(["guide"]), checkSchema({
  title: {
    in: ['body'],
    notEmpty: true
  },
  length: {
    in: ['body'],
    isFloat: true
  },
  ascent: {
    in: ['body'],
    isFloat: true
  },
  difficulty: {
    in: ['body'],
    isInt: true
  },
  description: {
    in: ['body'],
    optional: true,
    notEmpty: true
  },
  gpstrack: {
    in: ['body'],
    optional: true,
    isFloat: true
  },
  startpointid: {
    in: ['body'],
    optional: true,
    isInt: true
  },
  endpointid: {
    in: ['body'],
    optional: true,
    isInt: true
  },
  reference_points: {
    optional: true,
    in: "body",
    isObject: true
  },
  "reference_points.created": {
    optional: true,
    in: "body",
    isArray: true
  },
  "reference_points.created.*": {
    optional: true,
    in: 'body',
    isInt: true
  },
  "reference_points.deleted": {
    optional: true,
    in: "body",
    isArray: true
  },
  "reference_points.deleted.*": {
    optional: true,
    in: 'body',
    isInt: true
  }
}), async (req: express.Request, res: express.Response) => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });

  try {
    const newHike = await createHike({
      title: req.body.title,
      length: req.body.length && parseFloat(req.body.length),
      ascent: req.body.ascent && parseFloat(req.body.ascent),
      expected_time: req.body.expected_time && parseInt(req.body.expected_time),
      difficulty: req.body.difficulty && parseInt(req.body.difficulty),
      description: req.body.description,
      gpstrack: await gpsUpload(req, res),
      startpointid: req.body.startpointid && parseInt(req.body.startpointid),
      endpointid: req.body.endpointid && parseInt(req.body.endpointid),
      reference_points: req.body.reference_points,
      localguideid: (req.user as User).id
    });
    return res.status(201).json(newHike);
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error: " + e });
  }
})


//Edit Hike
hRouter.put("/:id", bigCheck(["guide"]), checkSchema({
  title: {
    in: ['body'],
    optional: true,
    notEmpty: true
  },
  length: {
    in: ['body'],
    optional: true,
    isFloat: true
  },
  expected_time: {
    in: ['body'],
    optional: true,
    isInt: true
  },
  ascent: {
    in: ['body'],
    optional: true,
    isFloat: true
  },
  difficulty: {
    in: ['body'],
    optional: true,
    isInt: true
  },
  description: {
    in: ['body'],
    optional: true,
    notEmpty: true
  },
  gpstrack: {
    in: ['body'],
    optional: true,
    notEmpty: true
  },
  startpointid: {
    in: ['body'],
    optional: true,
    isInt: true
  },
  endpointid: {
    in: ['body'],
    optional: true,
    isInt: true
  },
  reference_points: {
    optional: true,
    in: "body",
    isObject: true
  },
  "reference_points.created": {
    optional: true,
    in: "body",
    isArray: true
  },
  "reference_points.created.*": {
    optional: true,
    in: 'body',
    isObject: true
  },
  "reference_points.deleted": {
    optional: true,
    in: "body",
    isArray: true
  },
  "reference_points.deleted.*": {
    optional: true,
    in: 'body',
    isObject: true
  },
  huts:{
    optional: true,
    in: "body",
    isObject: true
  },
  "huts.created": {
    optional: true,
    in: "body",
    isArray: true
  },
  "huts.created.*": {
    optional: true,
    in: 'body',
    isInt: true
  },
  "huts.deleted": {
    optional: true,
    in: "body",
    isArray: true
  },
  "huts.deleted.*": {
    optional: true,
    in: 'body',
    isInt: true
  }
}), async (req: express.Request, res: express.Response) => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
  try {
    const id: number = parseInt(req.params.id, 10);
    const h = await hikeById(id);
    if (!h) return res.status(404).json({ errors: [{ msg: "Hike not found" }] });
    if (h.localguideid !== (req.user as User).id) return res.status(403).json({ errors: [{ msg: "You are not the owner of this hike" }] });
    const gpst = await gpsUpload(req, res);
    if (typeof gpst !== "string" && gpst !== undefined) return res.status(400).json({ errors: [{ msg: "Invalid GPS Track" }] });
    const modifiedHike = await editHike(id, {
      title: req.body.title,
      length: req.body.length && parseFloat(req.body.length),
      expected_time: req.body.expected_time && parseInt(req.body.expected_time),
      ascent: req.body.ascent && parseFloat(req.body.ascent),
      difficulty: req.body.difficulty && parseInt(req.body.difficulty),
      description: req.body.description,
      gpstrack: gpst,
      huts: req.body.huts,
      startpointid: req.body.startpointid && parseInt(req.body.startpointid),
      endpointid: req.body.endpointid && parseInt(req.body.endpointid),
      reference_points: req.body.reference_points,
      localguideid: (req.user as User).id
    });
    return res.status(201).json(modifiedHike);
  } catch (e) {
    return null;
  }
})

async function gpsUpload(req: express.Request, res: express.Response) {
  let file = undefined
  try {
    if (req.files) {
      const track = req.files.gpstrack
      if (!(track instanceof Array)) {
        const rand = (Math.random() + 1).toString(36).substring(7)
        const trackPath = path.join(path.resolve(__dirname, '..'), 'gpstracks', rand, track.name);
        track.mv(trackPath, (err) => {
          if (err) return res.status(500);
        });
        file = `api/gpstracks/${rand}/${track.name}`;
      }
    }
    return file;
  } catch (e) {
    return res.status(500);
  }
}

//Delete Hike
hRouter.delete("/:id", bigCheck(["guide"]), checkSchema({
  id: {
    in: ['params'],
    isInt: true
  }
}), async (req: express.Request, res: express.Response) => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
  try {
    const id: number = parseInt(req.params.id, 10);
    const h = await hikeById(id);
    if (!h) return res.status(404).json({ errors: [{ msg: "Hike not found" }] });
    if (h.localguideid !== (req.user as User).id) return res.status(403).json({ errors: [{ msg: "You are not the owner of this hike" }] });
    await deleteHike(id);
    return res.status(204).send();
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error: " + e });
  }
})
