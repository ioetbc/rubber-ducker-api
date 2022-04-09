require("dotenv-safe").config();
import { Strategy } from "passport-github";
import passport from "passport";
import jwt from "jsonwebtoken";
import isEmpty from "lodash/isEmpty";

import { findUser, createUser } from "./db";

export const authenticateUser = (app: any) => {
  passport.serializeUser((user: any, done: any) => {
    done(null, user.accessToken);
  });
  app.use(passport.initialize());
  passport.use(
    new Strategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
      },
      async (_, __, profile: any, done) => {
        let user = await findUser({ github_id: profile.id });

        let userId = profile.id;
        // might want to update the user if it exists e.g. avatar
        if (isEmpty(user)) {
          const { username, id } = profile;
          await createUser({
            username,
            avatar_url: profile._json.avatar_url,
            github_id: id,
          });
        }
        done(null, {
          accessToken: jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "1y",
          }),
          refreshToken: "",
        });
      }
    )
  );
  app.get("/auth/github", passport.authenticate("github", { session: false }));
  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    function (req: any, res: any) {
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
  );
};
