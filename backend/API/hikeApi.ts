import express, { RequestHandler, Router } from "express";
import path from "path";
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
    isFloat: true
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
  StartPointId: {
    in: ['body'],
    optional: true,
    isInt: true
  },
  EndPointId: {
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
  }
}), async (req: express.Request, res: express.Response) => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
  
  const idLG = getID(req);
  if (!idLG) return res.status(401).json({ error: "Unauthorized" });
  // const hike = req.body;
  let hike: any = {
    Title: req.body.Title,
    Length: parseInt(req.body.Length),
    Expected_time: parseInt(req.body.Expected_time),
    Ascent: parseInt(req.body.Ascent),
    Difficulty: parseInt(req.body.Difficulty),
    Description: req.body.Description,
    StartPointId: parseInt(req.body.StartPointId),
    EndPointId: parseInt(req.body.EndPointId),
    LocalGuideId: idLG,
  }


  hike.GpsTrack = await gpsUpload(req, res);

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
    isFloat: true
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
  StartPointId: {
    in: ['body'],
    optional: true,
    isInt: true
  },
  EndPointId: {
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
}), async (req: express.Request, res: express.Response) => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: validationResult(req).array() });
  const id: number = parseInt(req.params.id, 10);
  const idHiker = getID(req);
  let hike: any = {
    Title: req.body.Title,
    Length: parseInt(req.body.Length),
    Expected_time: parseInt(req.body.Expected_time),
    Ascent: parseInt(req.body.Ascent),
    Difficulty: parseInt(req.body.Difficulty),
    Description: req.body.Description,
    StartPointId: parseInt(req.body.StartPointId),
    EndPointId: parseInt(req.body.EndPointId),
    LocalGuideId: idHiker,
  }
  // if (!idHiker) return res.status(401).json({ error: "Unauthorized" });
  hike.GpsTrack = await gpsUpload(req, res);
  const modifiedHike = await editHike(id, hike, idHiker);
  return res.status(201).json(modifiedHike);
})

async function gpsUpload(req: express.Request, res: express.Response) {
  let file = undefined
  if (req.files) {
    const track = req.files.GpsTrack
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
