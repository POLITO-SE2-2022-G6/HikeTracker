import express, { RequestHandler, Router } from "express";
import passport from "passport";
import passportLocal from "passport-local";
import session from "express-session";
import { app } from "../index";
import { checkSchema, validationResult } from 'express-validator';
import { createUsr, getUserByEmail, verifyCode } from "../DAO/authDao";
import { User } from "@prisma/client";
import nodemailer from "nodemailer";

export const aRouter = Router();

export const isLoggedIn: RequestHandler = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: "not authenticated" });
};

const transporter = nodemailer.createTransport({
    host: "smtp.studenti.polito.it",
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER || "",
        pass: process.env.EMAIL_PASSWORD || ""
    },
    logger: true
});

export const bigCheck = (role: string[]) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (!req.isAuthenticated()) return res.status(401).json({ error: "not authenticated" });

        if (!role.includes((req.user as User).type) && ((req.user as User).type) !== "manager") return res.status(401).json({ error: "not authorized" });

        if (((req.user as User).type) === "guide" && (req.user as User).verified === false) return res.status(401).json({ error: "guide not verified" });

        return next();
    }
}

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
    },
    hutid: {
        in: "body",
        optional: true,
        isInt: true,
        errorMessage: "hutid must be a valid integer",
    },
}), async (req: express.Request, res: express.Response) => {
    const { type, username, email, phoneNumber, hutid } = req.body as Record<string, string>;
    const id = parseInt(hutid, 10);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const verificationCode = Math.floor(Math.random() * 1000000).toString();
        const user = await createUsr(type, username, email, phoneNumber, id, verificationCode)
        await transporter.sendMail({
            from: '"HikeTracker" <s303395@studenti.polito.it>',
            to: email,
            subject: "Verification",
            text: ("Verification Link: https://localhost:3001/api/auth/verify/" + verificationCode)
        });
        res.status(200).json(user);
    }
    catch (err) {
        return res.status(400).json(err);
    }
})

aRouter.get("/verify/:code", isLoggedIn, async (req: express.Request, res: express.Response) => {
    const { code } = req.params;

    try {
        const response = await verifyCode((req.user as User).email, code);
        if (!response) return res.status(400).json({ error: "Code not found" });
        res.status(200).send("OK")

    } catch(err) {
        return res.status(500).send("error")
    }


})


// Login --> POST /sessions
aRouter.post("/login", function (req, res, next) {
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
aRouter.delete("/logout", (req, res) => {
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