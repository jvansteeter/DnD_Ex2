import {Router, Request, Response} from 'express';
import * as passport from 'passport';


/**********************************************************************************************************
 * AUTHORIZATION ROUTER
 * /auth
 * Responsible for all authentication and authorization based calls
 *********************************************************************************************************/
export class LoginRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/login', passport.authenticate('local'), (req: Request, res: Response) => {
            res.send('OK')
        });
    }

}

const router = new LoginRouter();
router.init();

export default router.router;