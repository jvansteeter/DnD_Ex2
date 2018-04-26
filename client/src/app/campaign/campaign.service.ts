import { Injectable } from '@angular/core';
import { CampaignRepository } from '../repositories/campaign.repository';
import { Observable } from 'rxjs/Observable';
import { IsReadyService } from '../utilities/services/isReady.service';
import { UserProfileService } from "../utilities/services/userProfile.service";
import { UserProfile } from "../types/userProfile";
import { SocialRepository } from "../social/social.repository";


@Injectable()
export class CampaignService extends IsReadyService {
    public campaignId: string;
    public campaign: any;
    public members: any[];
    public encounters: any[];

    private gameMaster: boolean = false;

    constructor(private campaignRepo: CampaignRepository,
                private socialRepo: SocialRepository,
                private userProfileService: UserProfileService) {
        super();
    }

    public init(): void {
        this.campaign = {};
        this.members = [];
        this.campaignRepo.getCampaign(this.campaignId).subscribe((campaign: any) => {
            this.campaign = campaign;
            this.campaignRepo.getCampaignMembers(this.campaignId).subscribe(members => {
                this.members = members;
                for (let member of members) {
                    if (member._id === this.userProfileService.getUserId()) {
                        this.gameMaster = member.gameMaster;
                    }
                }
                this.getEncounters();
                this.setReady(true);
            });
        });
    }

    public setCampaignId(id: string): void {
        this.campaignId = id;
        this.setReady(false);
        this.init();
    }

    public isGameMaster(): boolean {
        return this.gameMaster;
    }

    public sendInvitations(friends: UserProfile[]): void {
        friends.forEach((friend: UserProfile) => {
            this.socialRepo.sendCampaignInvite(friend._id, this.campaignId);
        });
    }

    public createEncounter(label: string): void {
        this.campaignRepo.createNewEncounter(label, this.campaignId).subscribe(() => {
            this.getEncounters();
        });
    }

    private getEncounters(): void {
        this.campaignRepo.getAllEncounters(this.campaignId).subscribe((encounters: any[]) => {
            this.encounters = encounters;
        });
    }
}