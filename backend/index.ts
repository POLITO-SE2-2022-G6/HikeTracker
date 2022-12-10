import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from 'express-fileupload'
import path from "path";

export const app = express();

app.use(bodyParser.json());

app.use(fileUpload({
  createParentPath: true,
}));

const port = 3001;

// cors, accept everything
app.use(cors(
  {
    origin: "http://localhost:3000",
    credentials: true
  }
));

// Hike APIs
import { hRouter } from "./API/hikeApi";
app.use('/api/hike', hRouter);

// Point APIs
import { pRouter } from "./API/pointApi";
app.use('/api/point', pRouter);

// Auth APIs
import { aRouter, isLoggedIn } from "./API/authApi";
app.use('/api/auth', aRouter);

// Hiker APIs
import{ uRouter} from "./API/hikerApi";
app.use('/api/hiker',uRouter);

// Manager APIs
import{ mRouter} from "./API/managerApi";
app.use('/api/manager',mRouter);

/*import { hutRouter } from "./API/hutAPI";
app.use('/api/hut');*/

// GPS APIs
app.use("/api/gpstracks", isLoggedIn, express.static(path.join(__dirname, "gpstracks")));

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
