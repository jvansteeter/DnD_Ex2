import * as passport from 'passport';
import { Strategy } from 'passport-local';
import { UserRepository } from '../db/repositories/user.repository';
import { UserModel } from '../db/models/user.model';

/***********************************************************************************************************************
 * PASSPORT CONFIG
 * Configures the passport authentication module
 **********************************************************************************************************************/

let userRepo = new UserRepository();

passport.serializeUser((user: any, next) => {
    next(null, user);
});

passport.deserializeUser((id: string, next) => {
    userRepo.findById(id)
        .then((user: UserModel) => {
            next(null, user);
        });
});

passport.use('local', new Strategy((username, password, next: Function) => {
    userRepo.findByUsername(username)
        .then((user: UserModel) => {
            console.log('here');
            console.log(user);
            user.testMethod();
            user.methods.checkPassword('bad password');
            //////////////////////////////////////////////////////////////////////////
            if (user.checkPassword(password)) {
                next(null, user);
            }
            else {
                next(null, false);
            }
            ///////////////////////////////////////////////////////////////////////
        });
}));