import express, { Router } from "express";
import path from "path";
import { checkSchema, validationResult } from 'express-validator';
import { createHike, editHike, hikeById, hikesList } from "../DAO/hikeDao";
import { isGuide, isLoggedIn } from "./authApi";
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

  res.send(await hikesList({
    difficulty: difficulty ? parseInt(difficulty) : undefined,
    city,
    province,
    region,
    length: length ? parseFloat(length) : undefined,
    ascent: ascent ? parseFloat(ascent) : undefined,
    expected_time: expected_time ? parseFloat(expected_time) : undefined
  }));
})

//Get hike by id
hRouter.get("/:id", isLoggedIn, async (req: express.Request, res: express.Response) => {
  const id = parseInt(req.params.id, 10);
  const hike = await hikeById(id);
  if (!hike) return res.status(404).json({ error: "Hike not found" });
  return res.status(200).json(hike);
})


//New Hike in Body
hRouter.post("", isGuide, checkSchema({
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
  
  const hike = req.body;
  hike.localguideid = (req.user as User).id;
  hike.gpstrack = await gpsUpload(req, res);

  const newHike = await createHike(hike);
  return res.status(201).json(newHike);
})


//Edit Hike
hRouter.put("/:id", isGuide, checkSchema({
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
  }
}), async (req: express.Request, res: express.Response) => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
  const id: number = parseInt(req.params.id, 10);
  const hike = req.body;
  hike.localguideid = (req.user as User).id;;
  hike.gpstrack = await gpsUpload(req, res);
  const modifiedHike = await editHike(id, hike);
  return res.status(201).json(modifiedHike);
})

async function gpsUpload(req: express.Request, res: express.Response) {
  let file = undefined
  if (req.files) {
    const track = req.files.gpstrack
    if (!(track instanceof Array)) {
      const rand = (Math.random() + 1).toString(36).substring(7)
      const trackPath = path.join(path.resolve(__dirname, '..'), 'gpstracks', rand, track.name);
      track.mv(trackPath, (err) => {
        if (err) return res.status(500).send(err);
      });
      file = `api/gpstracks/${rand}/${track.name}`;
    }
  }
  return file;
}
