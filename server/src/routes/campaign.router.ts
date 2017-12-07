import { Router, Request, Response } from 'express';
import { CampaignService } from '../services/campaign.service';


/**********************************************************************************************************
 * Campaign ROUTER
 * /api/campaign
 * Responsible for all routes related to campaigns
 *********************************************************************************************************/
export class CampaignRouter {
    router: Router;

    private campaignService: CampaignService;

    constructor() {
        this.router = Router();

        this.campaignService = new CampaignService();
        this.init();
    }

    init() {
        this.router.post('/create', (req: Request, res: Response) => {
            this.campaignService.create(req.body.label, req.body.ruleSetId).then(() => {
                res.status(200).send("OK");
            }).catch(error => res.status(500).send(error));
        });
    }
}

export default new CampaignRouter().router;