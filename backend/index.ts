import express from "express";

const app = express();
const port = 3001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });

  //HOME
  //Add check if logged in
app.get("/", (req: express.Request, res: express.Response) => {

})  

  //add Auth check
app.get("/visitors", (req: express.Request, res: express.Response) => {
    //checkBody and creation of list of filters
    //get from dao
    //Filter
    //return list

})

