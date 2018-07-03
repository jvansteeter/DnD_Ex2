import { CampaignModel } from '../db/models/campaign.model';
import { CampaignRepository } from '../db/repositories/campaign.repository';
import { UserCampaignModel } from '../db/models/user-campaign.model';
import { UserCampaignRepository } from '../db/repositories/user-campaign.repository';
// import { Promise } fromUserId 'bluebird';
import { UserRepository } from '../db/repositories/user.repository';
import { UserModel } from '../db/models/user.model';
import { NotificationRepository } from '../db/repositories/notification.repository';
import { NotificationModel } from '../db/models/notification.model';
import { ServerError } from '../../../shared/errors/ServerError';
import { NotificationType } from '../../../shared/types/notifications/notification-type.enum';
import { CampaignInviteNotification } from '../../../shared/types/notifications/CampaignInviteNotification';

export class CampaignService {
    private campaignRepository: CampaignRepository;
    private userRepository: UserRepository;
    private notificationRepo: NotificationRepository;
    private userCampaignRepository: UserCampaignRepository;

    constructor() {
        this.campaignRepository = new CampaignRepository();
        this.userRepository = new UserRepository();
        this.notificationRepo = new NotificationRepository();
        this.userCampaignRepository = new UserCampaignRepository();
    }

    public create(label: string, ruleSetId: string, userId: string): Promise<CampaignModel> {
        return new Promise((resolve, reject) => {
            this.campaignRepository.create(label, ruleSetId).then((campaign: CampaignModel) => {
                this.userCampaignRepository.create(userId, campaign._id, true).then(() => {
                    resolve(campaign);
                }).catch(error => reject(error));
            }).catch(error => reject(error));
        });
    }

    public getCampaign(campaignId: string): Promise<CampaignModel> {
        return this.campaignRepository.findById(campaignId);
    }

    public join(userId: string, campaignId: string): Promise<UserCampaignModel> {
        return new Promise((resolve, reject) => {
            this.notificationRepo.findAllToByType(userId, NotificationType.CAMPAIGN_INVITE).then((notifications: NotificationModel[]) => {
                let count = notifications.length;
                if (count === 0) {
                    reject(new Error(ServerError.NOT_INVITED));
                    return;
                }

                notifications.forEach((notification: NotificationModel) => {
                    let campaignInvite = notification.notificationData as CampaignInviteNotification;
                    if (campaignInvite.campaignId === campaignId) {
                        this.notificationRepo.removeById(notification._id).then(() => {
                            this.userCampaignRepository.create(userId, campaignId, false).then((userCampaign: UserCampaignModel) => {
                                resolve(userCampaign);
                                return;
                            });
                        }).catch(error => reject(error));
                    }
                    else if (--count === 0) {
                         reject(new Error(ServerError.NOT_INVITED));
                    }
                });

            }).catch(error => reject(error));
        });

    }

    public findAllForUser(userId: string): Promise<CampaignModel[]> {
        return new Promise((resolve, reject) => {
            this.userCampaignRepository.findAllForUser(userId).then((userCampaigns: UserCampaignModel[]) => {
                 let userCampaignCount = userCampaigns.length;
                 if (userCampaignCount === 0) {
                     resolve([]);
                     return;
                 }

                 let campaigns: CampaignModel[] = [];
                 userCampaigns.forEach((userCampaign : UserCampaignModel) => {
                     this.campaignRepository.findById(userCampaign.campaignId).then((campaign: CampaignModel) => {
                         campaigns.push(campaign);

                         if (--userCampaignCount === 0) {
                             resolve(campaigns);
                         }
                     }).catch(error => reject(error));
                 });
            }, error => reject(error));
        });
    }

    public findAllForCampaign(campaignId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.userCampaignRepository.findAllForCampaign(campaignId).then((userCampaigns: UserCampaignModel[]) => {
                let userCampaignCount = userCampaigns.length;
                if (userCampaignCount === 0) {
                    resolve([]);
                    return;
                }

                let members: any[] = [];
                userCampaigns.forEach((userCampaign : UserCampaignModel) => {
                    this.userRepository.findById(userCampaign.userId).then((user: UserModel) => {
                        var userData = JSON.parse(JSON.stringify(user));
                        delete userData.passwordHash;
                        userData['gameMaster'] = userCampaign.gameMaster;
                        members.push(userData);

                        if (--userCampaignCount === 0) {
                            resolve(members);
                        }
                    }).catch(error => reject(error));
                });
            }, error => reject(error));
        });
    }
}