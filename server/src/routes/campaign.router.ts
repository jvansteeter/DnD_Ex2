import { Router, Request, Response } from 'express';
import { CampaignService } from '../services/campaign.service';
import { CampaignModel } from '../db/models/campaign.model';


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
            this.campaignService.create(req.body.label, req.body.ruleSetId, req.user._id).then((campaign: CampaignModel) => {
                res.json(campaign);
            }).catch(error => res.status(500).send(error));
        });

        this.router.get('/all', (req: Request, res: Response) => {
            this.campaignService.findAllForUser(req.user._id).then((campaigns: CampaignModel[]) => {
                res.json(campaigns);
            }).catch(error => res.status(500).send(error));
        });

        this.router.post('/join', (req: Request, res: Response) => {
             this.campaignService.join(req.user._id, req.body.campaignId).then(() => {
                 res.status(200).send("OK");
             }).catch(error => res.status(500).send(error));
        });

        this.router.get('/campaign/:campaignId', (req: Request, res: Response) => {
            this.campaignService.getCampaign(req.params.campaignId).then((campaign: CampaignModel) => {
                res.json(campaign);
            }).catch(error => res.status(500).send(error));
        });

        this.router.get('/members/:campaignId', (req: Request, res: Response) => {
            this.campaignService.findAllForCampaign(req.params.campaignId).then(members => {
                res.json(members);
            }).catch(error => res.status(500).send(error));
        });

        this.router.post('/invite/:campaignId', (req: Request, res: Response) => {
            this.campaignService.inviteUsers(req.params.campaignId, req.user._id, req.body).then((success) => {

            }).catch(error => res.status(500).send(error));
        });
    }
}

export default new CampaignRouter().router;