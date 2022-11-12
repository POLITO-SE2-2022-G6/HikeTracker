import express from "express";
const { validationResult, query } = require('express-validator');
import { stringify } from "querystring";
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

function validateParameters(props: any){
  return (true && (props("city").exists().isLength({min:1}) || props("city").exists({checkFalsy: true})) 
  && (props("province").exists().isLength({min:1}) || props("province").exists({checkFalsy: true})) 
  && (props("region").exists().isLength({min:1}) || props("region").exists({checkFalsy: true}))
  && (props("difficulty").exists().isLength({min:1}) || props("difficulty").exists({checkFalsy: true}))
  && (props("length").exists().isLength({min:1}) || props("difficulty").exists({checkFalsy: true}))
  && (props("ascent").exists().isLength({min:1}) || props("ascent").exists({checkFalsy: true})) 
  && (props("expected_time").exists().isNumeric() || props("expected_time").exists({checkFalsy: true})))
}
//HOME
//Add check if logged in
app.get("/", validateParameters(query()) , async (req: express.Request, res: express.Response) => {
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
app.post("/", /*queryValidation*/async (req: express.Request, res: express.Response) => {

  try {
    const hike = req.body;
    const newHike = await createHike(hike);
    return res.status(201).json(newHike);
  } catch (error: any) {
    return res.status(500).json(error);
  }
  
})

//Edit Hike
app.put("/:id", /*queryValidation*/async (req: express.Request, res: express.Response) => {

  const id: number = parseInt(req.params.id, 10);
  try {
    const params = req.body;
    const modifiedHike = await editHike(id,params);
    return res.status(201).json(modifiedHike);
  } catch (error: any) {
    return res.status(500).json(error);
  }
  
})



