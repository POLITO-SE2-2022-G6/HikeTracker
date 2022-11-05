import express from "express";
import { hikesList, getPList } from "./visitorDao"

const app = express();
const port = 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

//HOME
//Add check if logged in
app.get("/", async (req: express.Request, res: express.Response) => {
  const { latitude, longitude, elevation, address, difficulty, length, ascent, expected_time } = req.query as Record<string, string>;

  const pList = getPList({latitude: parseFloat(latitude), longitude: parseFloat(longitude), elevation: parseFloat(elevation)})

    //filter pList with address if present in req.query

  const hList = hikesList({
    difficulty: difficulty,
    length: parseFloat(length),
    ascent: parseFloat(ascent),
    expected_time: parseFloat(expected_time)}
    );

    //filter hlist with plist to have the final list to output

  res.send(hList);
})


