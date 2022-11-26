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

// Auth APIs
import { aRouter, isLoggedIn } from "./API/authApi";
app.use('/api/sessions', aRouter);

// GPS APIs
app.use("/gpstracks", isLoggedIn, express.static(path.join(__dirname, "gpstracks")));


app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
