import express, { RequestHandler } from "express";
import passport from "passport";
import passportLocal from "passport-local";
import session from "express-session";
import { validationResult, query, body, checkSchema } from 'express-validator';
import { hikesList, createHike, editHike } from "./visitorDao"
import cors from "cors";
import { getUserById, getUserByEmail, createUsr } from "./auth";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const port = 3001;
const LocalStrategy = passportLocal.Strategy;

export type User = {
  id: number,
  email: string,
  type: string,
  username: string,
  phoneNumber: string
}

passport.serializeUser<any, any>((req, user, done) => { done(undefined, user); });

// cors, accept everything
app.use(cors(
  {
    origin: "http://localhost:3000",
    credentials: true
  }
));

passport.deserializeUser((usr: User, done) => {
  // const usr = getUserById(id);
  // if (!usr) done("User not found", undefined);
  // else 
  done(undefined, usr);
});

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
},
  async (email, p, done) => {
    console.log("LocalStrategy", email, p);

    const usr = await getUserByEmail(email);
    if (!usr) done("User not found", undefined);
    else done(undefined, usr);
  }))



app.use(
  session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret:
      "a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "not authenticated" });
};

/*** Users APIs ***/
// signup
app.post("/signup", checkSchema({
  type: {
    in: "query",
    isString: true
  },
  username: {
    in: "query",
    isString: true
  },
  email: {
    in: "query",
    isEmail: true
  },
  phoneNumber: {
    in: "query",
    isMobilePhone: true
  }
}), async (req: express.Request, res: express.Response) => {
  const { type, username, email, phoneNumber } = req.query as Record<string, string>;
  createUsr(type, username, email, phoneNumber).then(() => { res.end() }).catch((err) => { res.status(500).json({ error: err }) });
})

// Login --> POST /sessions
app.post("/api/sessions", function (req, res, next) {
  console.log("POST /api/sessions", req.body);
  passport.authenticate("local", (err, user, info) => {
    console.log("passport.authenticate", err, user, info);
    if (err) return next(err);
    if (!user) return res.status(401).json(info);

    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);
      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// Logout --> DELETE /sessions/current 
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });

});

// GET /sessions/current
// check whether the user is logged in or not
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

//HOME
//Add check if logged in
app.get("/",
  query("city").optional().notEmpty(), query("province").optional().notEmpty(), query("region").optional().notEmpty(),
  query("difficulty").optional().notEmpty(), query("length").optional().isFloat(), query("ascent").optional().isFloat(),
  query("expected_time").optional().isFloat(), async (req: express.Request, res: express.Response) => {
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
  async (req, res) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ errors: "Illegal Data" });
    const id: number = parseInt(req.params!.id, 10);
    const params = req.body;
    const modifiedHike = await editHike(id, params);
    return res.status(201).json(modifiedHike);
  })
