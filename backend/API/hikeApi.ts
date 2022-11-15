import express from "express";
import path from "path";
import { RequestHandler, Router } from 'express';
import { body, checkSchema, query, validationResult  } from 'express-validator';
import { createHike, editHike, hikeById, hikesList } from "../DAO/hikeDao";
import { User, isLoggedIn } from "./authApi";

export const hRouter = Router();

const isGuide: RequestHandler = (req, res, next) => {
    if (req.isAuthenticated() && (req.user as User).type === "Guide") return next();
    return res.status(401).json({ error: "not authenticated" });
  }


//HOME
//Add check if logged in
hRouter.get("",
  query("city").optional().notEmpty(), query("province").optional().notEmpty(), query("region").optional().notEmpty(),
  query("difficulty").optional().isInt(), query("length").optional().isFloat(), query("ascent").optional().isFloat(),
  query("expected_time").optional().isFloat(), async (req: express.Request, res: express.Response) => {
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
hRouter.get("/:id", isLoggedIn, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const hike = await hikeById(id);
  return res.status(200).json(hike);
})


//New Hike in Body
hRouter.post("", isGuide,
  body("title").exists().notEmpty(), body("length").exists().notEmpty(), body("expected_time").exists().isInt(),
  body("ascent").exists().isFloat(), body("difficulty").exists().isInt(), body("description").optional().notEmpty(),
  body("gpstrack").optional().notEmpty(), body("start_point").optional().isInt(), body("end_point").optional().isInt(), checkSchema({
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
  }),
  async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });

    const hike = req.body;
    hike.gpstrack = await gpsUpload(req, res);

    const newHike = await createHike(hike);
    return res.status(201).json(newHike);
  })


//Edit Hike
hRouter.put("/:id", isGuide,
  body("title").optional().notEmpty(), body("length").optional().notEmpty(), body("expected_time").optional().isInt(),
  body("ascent").optional().isFloat(), body("difficulty").optional().isInt(), body("description").optional().notEmpty(),
  body("gpstrack").optional().notEmpty(), body("start_point").optional().isInt(), body("end_point").optional().isInt(), checkSchema({
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
  }),
  async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    const id: number = parseInt(req.params.id, 10);
    const params = req.body;
    params.gpstrack = await gpsUpload(req, res);
    const modifiedHike = await editHike(id, params);
    return res.status(201).json(modifiedHike);
})


hRouter.get("/:id", isLoggedIn, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const hike = await hikeById(id);
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