import express, { response } from "express";
import { stringify } from "querystring";
import { hikesList, createHike, editHike } from "./visitorDao"

const app = express();
const port = 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

//HOME
//Add check if logged in and middleware to validate data in req.query
app.get("/", /*queryValidationCheck,*/ async (req: express.Request, res: express.Response) => {
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



