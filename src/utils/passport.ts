import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Users } from "../modules/user/user.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!, 
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Google"));

        let user = await Users.findOne({ where: { email } });

        if (!user) {
          user = await Users.create({
            fullname: profile.displayName,
            email,
            password: "",
            phone: null,
            role: "user",
            registerMethod: "googleAuth",
            refreshToken: null,
          });
        }

        return done(null, user.get({ plain: true })as any);
      } catch (err) {
        return done(err);
      }
    }
  )
);

export default passport;