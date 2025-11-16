const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { pool } = require('./database');
require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (payload, done) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, rol FROM users WHERE id = ?',
      [payload.id]
    );

    if (rows.length > 0) {
      return done(null, rows[0]);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;

