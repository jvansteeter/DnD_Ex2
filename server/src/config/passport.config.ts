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
            if (!user) {
                next(null, false);
                return;
            }
            if (user.checkPassword(password)) {
                next(null, user);
            }
            else {
                next(null, false);
            }
        }).catch(error => {
            console.error(error);
            next(null, false);
        });
}));