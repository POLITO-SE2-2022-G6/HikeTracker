import express from "express";
import path from "path";
import { Router } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { createHike, editHike, hikeById, hikesList } from "../DAO/hikeDao";
import { isGuide, isLoggedIn, getID } from "./authApi";

export const hRouter = Router();

//HOME
//Add check if logged in
hRouter.get("", checkSchema({
  city: {
    in: ['query'],
    optional: true,
    notEmpty: true
  },
  province: {
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
hRouter.get("/:id", isLoggedIn, checkSchema({
  hut: {
    in: ['query'],
    optional: true,
    isBoolean: true
  },
  parking_lot: {
    in: ['query'],
    optional: true,
    isBoolean: true
  }
}), async (req: express.Request, res: express.Response) => {
  const id = parseInt(req.params.id, 10);
  const hike = await hikeById(id, req.query);
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
    notEmpty: true
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
  start_point: {
    in: ['body'],
    isInt: true
  },
  end_point: {
    in: ['body'],
    optional: true,
    isInt: true
  },
  reference_points: {
    optional: true,
    in: "body",
    isArray: true
  },
  "reference_points.*": {
    optional: true,
    in: 'body',
    isInt: true
  }
}),  async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });

    const hike = req.body;
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
    notEmpty: true
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
  start_point: {
    in: ['body'],
    optional: true,
    isObject: true
  },
  "start_point.id":{
    in: ['body'],
    optional: true,
    isInt: true
  },
  end_point: {
    in: ['body'],
    optional: true,
    isObject: true
  },
  "end_point.id":{
    in: ['body'],
    optional: true,
    isInt: true
  },
  reference_points: {
    optional: true,
    in: "body",
    isArray: true
  },
  "reference_points.*": {
    optional: true,
    in: 'body',
    isInt: true
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


hRouter.get("/:id", isLoggedIn, /*checkSchema(
  hut:{
    in: ['query'],
    optional: true,
    isBoolean: true
  },

),*/ async (req: express.Request, res:express.Response) => {
  const id = parseInt(req.params.id, 10);
  const hike = await hikeById(id, req.query);
  return res.status(200).json(hike);
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
      file = `gpstracks/${rand}/${track.name}`;
    }
  }
  return file;
}