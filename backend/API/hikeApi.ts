import express from "express";
import path from "path";
import { Router } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { createHike, editHike, hikeById, hikesList } from "../DAO/hikeDao";
import { isGuide, isLoggedIn, getID } from "./authApi";

export const hRouter = Router();

//HOME
hRouter.get("", checkSchema({
  City: {
    in: ['query'],
    optional: true,
    notEmpty: true
  },
  Province: {
    in: ['query'],
    optional: true,
    notEmpty: true
  },
  Region: {
    in: ['query'],
    optional: true,
    notEmpty: true
  },
  Difficulty: {
    in: ['query'],
    optional: true,
    isInt: true
  },
  Length: {
    in: ['query'],
    optional: true,
    isFloat: true
  },
  Ascent: {
    in: ['query'],
    optional: true,
    isFloat: true
  },
  Expected_time: {
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
  Title: {
    in: ['body'],
    notEmpty: true
  },
  Length: {
    in: ['body'],
    notEmpty: true
  },
  Ascent: {
    in: ['body'],
    isFloat: true
  },
  Difficulty: {
    in: ['body'],
    isInt: true
  },
  Description: {
    in: ['body'],
    optional: true,
    notEmpty: true
  },
  GpsTrack: {
    in: ['body'],
    optional: true,
    isFloat: true
  },
  Start_point: {
    in: ['body'],
    optional: true,
    isInt: true
  },
  End_point: {
    in: ['body'],
    optional: true,
    isInt: true
  },
  Reference_points: {
    optional: true,
    in: "body",
    isObject: true
  },
  "Reference_points.created": {
    optional: true,
    in: "body",
    isArray: true
  },
  "Reference_points.created.*": {
    optional: true,
    in: 'body',
    isInt: true
  },
  "Reference_points.deleted": {
    optional: true,
    in: "body",
    isArray: true
  },
  "Reference_points.deleted.*": {
    optional: true,
    in: 'body',
    isInt: true
  },
  LocalGuideId: {
    in: ['body'],
    isInt: true
  }
}),  async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });

    const hike = req.body;
    hike.gpstrack = await gpsUpload(req, res);

    const newHike = await createHike(hike);
    return res.status(201).json(newHike);
  })


//Edit Hike
hRouter.put("/:id", isGuide, checkSchema({
  Title: {
    in: ['body'],
    optional: true,
    notEmpty: true
  },
  Length: {
    in: ['body'],
    optional: true,
    notEmpty: true
  },
  Expected_time: {
    in: ['body'],
    optional: true,
    isInt: true
  },
  Ascent: {
    in: ['body'],
    optional: true,
    isFloat: true
  },
  Difficulty: {
    in: ['body'],
    optional: true,
    isInt: true
  },
  Description: {
    in: ['body'],
    optional: true,
    notEmpty: true
  },
  GpsTrack: {
    in: ['body'],
    optional: true,
    notEmpty: true
  },
  Start_point: {
    in: ['body'],
    optional: true,
    isObject: true
  },
  "Start_point.id":{
    in: ['body'],
    optional: true,
    isInt: true
  },
  End_point: {
    in: ['body'],
    optional: true,
    isObject: true
  },
  "End_point.id":{
    in: ['body'],
    optional: true,
    isInt: true
  },
  Reference_points: {
    optional: true,
    in: "body",
    isObject: true
  },
  "Reference_points.created": {
    optional: true,
    in: "body",
    isArray: true
  },
  "Reference_points.created.*": {
    optional: true,
    in: 'body',
    isObject: true
  },
  "Reference_points.deleted": {
    optional: true,
    in: "body",
    isArray: true
  },
  "Reference_points.deleted.*": {
    optional: true,
    in: 'body',
    isObject: true
  }
}),  async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    const id: number = parseInt(req.params.id, 10);
    const params = req.body;
    const idHiker = getID(req);
    if (!idHiker) return res.status(401).json({ error: "Unauthorized" });
    params.gpstrack = await gpsUpload(req, res);
    const modifiedHike = await editHike(id, params, idHiker);
    return res.status(201).json(modifiedHike);
  })

async function gpsUpload(req: express.Request, res: express.Response) {
  let file = undefined
  if (req.files) {
    const track = req.files.gpstrack
    if (!(track instanceof Array)) {
      const rand = (Math.random() + 1).toString(36).substring(7)
      const trackPath = path.join(__dirname, 'gpstracks', rand, track.name);
      track.mv(trackPath, (err) => {
        if (err) return res.status(500).send(err);
      });
      file = `../gpstracks/${rand}/${track.name}`;
    }
  }
  return file;
}
