import {Router, Request, Response} from 'express';


/**********************************************************************************************************
 * User ROUTER
 * /api/user
 * Responsible for getting user based information
 *********************************************************************************************************/
export class UserRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/profile', (req: Request, res: Response) => {
            res.json(req.user);
        });
    }

}

export default new UserRouter().router;