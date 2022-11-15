import express from "express";
import passport from "passport";
import passportLocal from "passport-local";
import session from "express-session";
import { app } from "../index";
import { RequestHandler, Router } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { createUsr, getUserByEmail } from "../DAO/authDao";

export const aRouter = Router();

export type User = {
    id: number,
    email: string,
    type: string,
    username: string,
    phoneNumber: string
}

export const isLoggedIn: RequestHandler = (req, res, next) => {
    console.log("is logged in", req.isAuthenticated());
    if (req.isAuthenticated()) return next();

    return res.status(401).json({ error: "not authenticated" });
};

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((req, user, done) => { done(undefined, user); });
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


// signup
aRouter.post("/signup", checkSchema({
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
aRouter.post("", function (req, res, next) {
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
aRouter.delete("/current", (req, res) => {
    req.logout(() => {
        res.end();
    });

});


// GET /sessions/current
// check whether the user is logged in or not
aRouter.get("/current", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else res.status(401).json({ error: "Unauthenticated user!" });
});