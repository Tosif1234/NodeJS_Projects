const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const admin = require('../model/adminSchema');
const bcrypt = require('bcrypt');

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await admin.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'User not found !!' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
          return done(null, false, { message: 'Wrong Password...' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("DESERIALIZE CALLED");

  try {
    const user = await admin.findById(id);
    console.log("DB ROLE:", user?.role);

    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
