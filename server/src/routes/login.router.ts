import {Router, Request, Response} from 'express';
import * as passport from 'passport';
import { UserRepository } from '../db/repositories/user.repository';
import { UserModel } from '../db/models/user.model';


/**********************************************************************************************************
 * AUTHORIZATION ROUTER
 * /auth
 * Responsible for all authentication and authorization based calls
 *********************************************************************************************************/
export class LoginRouter {
    private userRepo: UserRepository;
    router: Router;

    constructor() {
        this.userRepo = new UserRepository();
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/login', passport.authenticate('local'), (req: Request, res: Response) => {
            res.send('OK')
        });

        this.router.post('/register', async (req: Request, res: Response) => {
            let username = req.body.username;
            let password = req.body.password;
            let firstName = req.body.firstName;
            let lastName = req.body.lastName;

            // this.userRepo.findByUsername(username).then((user: UserModel) => {
            //     if (user) {
            //         res.status(403).send('Username already exists');
            //         return;
            //     }
            //
            //     this.userRepo.create(username, password, firstName, lastName)
            //         .then(() => {
            //             res.send('OK');
            //         }, (error) => {
            //             console.error(error);
            //             res.status(500).send(error);
            //         });
            // })

            try {
                const user: UserModel = await this.userRepo.findByUsername(username);
                if (user) {
                    res.status(403).send('Username already exists');
                    return;
                }

                await this.userRepo.create(username, password, firstName, lastName);
                res.send('OK');
            }
            catch (error) {
                console.error(error);
                res.status(500).send(error);
            }
        });
    }

}

export default new LoginRouter().router;