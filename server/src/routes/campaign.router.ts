import { Router, Request, Response } from 'express';
import { CampaignService } from '../services/campaign.service';
import { CampaignModel } from '../db/models/campaign.model';
import { EncounterService } from "../services/encounter.service";
import { EncounterModel } from '../db/models/encounter.model';
import { CampaignData } from '../../../shared/types/campaign.data';


/**********************************************************************************************************
 * Campaign ROUTER
 * /api/campaign
 * Responsible for all routes related toUserId campaigns
 *********************************************************************************************************/
export class CampaignRouter {
	router: Router;

	private campaignService: CampaignService;
	private encounterService: EncounterService;

	constructor() {
		this.router = Router();

		this.campaignService = new CampaignService();
		this.encounterService = new EncounterService();
		this.init();
	}

	init() {
		this.router.post('/create', (req: Request, res: Response) => {
			this.campaignService.create(req.body.label, req.body.ruleSetId, req.user._id).then((campaign: CampaignModel) => {
				res.json(campaign);
			}).catch(error => res.status(500).send(error));
		});

		this.router.post('/delete', async (req: Request, res: Response) => {
			try {
				const userId: string = req.user._id;
				const campaignId: string = req.body.campaignId;
				await this.campaignService.delete(userId, campaignId);
				res.status(200).send();
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.get('/all', (req: Request, res: Response) => {
			this.campaignService.findAllForUser(req.user._id).then((campaigns: CampaignModel[]) => {
				res.json(campaigns);
			}).catch(error => res.status(500).send(error));
		});

		this.router.post('/join', async (req: Request, res: Response) => {
			try {
				await this.campaignService.join(req.user._id, req.body.campaignId);
				res.status(200).send('OK');
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.get('/campaign/:campaignId', (req: Request, res: Response) => {
			this.campaignService.getCampaign(req.params.campaignId).then((campaign: CampaignData) => {
				res.json(campaign);
			}).catch(error => res.status(500).send(error));
		});

		this.router.get('/members/:campaignId', async (req: Request, res: Response) => {
			try {
				const campaignId = req.params.campaignId;
				const members = await this.campaignService.findAllForCampaign(campaignId);
				res.json(members);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/newEncounter/:campaignId', async (req: Request, res: Response) => {
			try {
				const userId = req.user._id;
				const label = req.body.label;
				const campaignId = req.params.campaignId;
				const mapUrl = req.body.mapUrl;
				const mapDimX = req.body.mapDimX;
				const mapDimY = req.body.mapDimY;
				await this.encounterService.create(userId, label, campaignId, mapDimX, mapDimY, mapUrl);
				res.status(200).send();
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.get('/encounters/:campaignId', (req: Request, res: Response) => {
			this.encounterService.getAllForCampaignId(req.params.campaignId).then((encounters: EncounterModel[]) => {
				res.json(encounters);
			}).catch(error => res.status(500).send(error));
		});

		this.router.post('/setGameMaster', async (req: Request, res: Response) => {
			try {
				const campaignId = req.body.campaignId;
				const userId = req.body.userId;
				const isGameMaster: boolean = req.body.isGameMaster === 'true';
				await this.campaignService.setIsGameMaster(campaignId, userId, isGameMaster);
				res.status(200).send();
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});
	}
}

export default new CampaignRouter().router;