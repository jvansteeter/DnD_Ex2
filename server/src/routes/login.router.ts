import {Router, Request, Response, NextFunction} from 'express';
import * as passport from 'passport';


/**********************************************************************************************************
 * AUTHORIZATION ROUTER
 * /auth
 *********************************************************************************************************/
export class LoginRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/login', passport.authenticate('local'), (req: Request, res: Response, next: NextFunction) => {
            console.log("returned from passport.authenticate with user:");
            console.log(req.user);
            res.send('OK')
        });
    }

}

const router = new LoginRouter();
router.init();

export default router.router;