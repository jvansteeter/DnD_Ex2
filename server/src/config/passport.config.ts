import * as passport from 'passport';
import { Strategy } from 'passport-local';

/***********************************************************************************************************************
 * PASSPORT CONFIG
 * Configures the passport authentication module
 **********************************************************************************************************************/

passport.serializeUser((user: any, next) => {
    next(null, user);
});

passport.deserializeUser((user, next) => {
    next(null, user);
});

passport.use('local', new Strategy((username, password, next: Function) => {
    next(null, {name: 'test user'})
}));