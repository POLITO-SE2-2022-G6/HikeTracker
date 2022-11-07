import express from "express";
import { stringify } from "querystring";
import { hikesList } from "./visitorDao"

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


