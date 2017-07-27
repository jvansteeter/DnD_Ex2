import * as passport from 'passport';
import { Strategy } from 'passport-local';

passport.serializeUser((user: any, next) => {
    next(null, user.id);
});

passport.deserializeUser((id, next) => {
    next(null, {name: 'test user'});
});

passport.use('local', new Strategy((username, password, next: Function) => {
    console.log('attempt to log in');
    console.log(username);
    console.log(password);
    next(null, {name: 'test user'})
}));