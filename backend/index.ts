import express, { RequestHandler } from "express";
import passport from "passport";
import passportLocal from "passport-local";
import session from "express-session";
import { validationResult, query, body, checkSchema } from 'express-validator';
import { hikesList, createHike, editHike,hikeById } from "./visitorDao"
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
  done(undefined, usr);
});

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
},
  async (email, p, done) => {
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
    in: "body",
    isString: true,
    errorMessage: "type must be a string",
  },
  username: {
    in: "body",
    isString: true,
    errorMessage: "username must be a string",
  },
  email: {
    in: "body",
    isEmail: true,
    errorMessage: "email must be a valid email",
  },
  phoneNumber: {
    in: "body",
    isMobilePhone: true,
    errorMessage: "phoneNumber must be a valid phone number",
  }
}), async (req: express.Request, res: express.Response) => {
  const { type, username, email, phoneNumber } = req.body as Record<string, string>;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await createUsr(type, username, email, phoneNumber)
    res.status(200).json(user);
  }
  catch (err) {
    return res.status(400).json(err);
  }
})

// Login --> POST /sessions
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
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
app.get("/hike",
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
  app.get("/hike/:id",isLoggedIn,async(req:express:Request,res:express.Response)=>{
    const id: number = parseInt(req.params.id, 10);
    const hike  = await hikeById(id);
    return res.status(201).json(hike);
  })


//New Hike in Body
app.post("/hike", isLoggedIn,
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
    const newHike = await createHike(hike);
    return res.status(201).json(newHike);
  })

//Edit Hike
app.put("/hike/:id", isLoggedIn,
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
    const modifiedHike = await editHike(id, params);
    return res.status(201).json(modifiedHike);
  })
