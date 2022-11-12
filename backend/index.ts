import express from "express";
import { validationResult, query, body } from 'express-validator';
import { hikesList, createHike, editHike } from "./visitorDao"
import cors from "cors";

const app = express();
const port = 3001;

app.use(cors({
    origin: "http://localhost:3000"
}));

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

//HOME
//Add check if logged in
app.get("/", 
  query("city").optional().notEmpty(), query("province").optional().notEmpty(), query("region").optional().notEmpty(),
  query("difficulty").optional().notEmpty(), query("length").optional().isFloat(), query("ascent").optional().isFloat(),
  query("expected_time").optional().isFloat(),  async (req: express.Request, res: express.Response) => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });

  const { city, province, region, difficulty, length, ascent, expected_time } = req.query as Record<string, string | undefined>;

  res.send(await hikesList({
    difficulty,
    city,
    province,
    region,
    length: length ? parseFloat(length) : undefined,
    ascent: ascent ? parseFloat(ascent) : undefined,
    expected_time: expected_time ? parseFloat(expected_time) : undefined
  }));
})


//New Hike in Body
app.post("/", 
  body("title").exists().notEmpty(), body("length").exists().notEmpty(), body("expected_time").exists().isInt(),
  body("ascent").exists().isFloat(), body("difficulty").exists().notEmpty(), body("description").exists().notEmpty(),
  body("gpstrack").optional().notEmpty(), 
  async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    const hike = req.body;
    const newHike = await createHike(hike);
    return res.status(201).json(newHike);
})

//Edit Hike
app.put("/:id",
  body("title").optional().notEmpty(), body("length").optional().notEmpty(), body("expected_time").optional().isInt(),
  body("ascent").optional().isFloat(), body("difficulty").optional().notEmpty(), body("description").optional().notEmpty(),
  body("gpstrack").optional().notEmpty(),
  async (req: express.Request, res: express.Response) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    const id: number = parseInt(req.params.id, 10);
    const params = req.body;
    const modifiedHike = await editHike(id,params);
    return res.status(201).json(modifiedHike);  
})



