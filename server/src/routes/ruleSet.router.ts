import {Router, Request, Response} from 'express';


/**********************************************************************************************************
 * Rule Set ROUTER
 * /api/ruleset
 * Responsible for getting and setting rule set data
 *********************************************************************************************************/
export class RuleSetRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/save', (req: Request, res: Response) => {
            console.log(req.body)
            res.send('OK');
        });
    }

}

export default new RuleSetRouter().router;