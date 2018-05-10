import { Pipe, PipeTransform } from '@angular/core';
import { UserProfileService } from '../utilities/services/userProfile.service';
import { CampaignService } from './campaign.service';

@Pipe({
  name: 'isGameMaster'
})
export class IsGameMasterPipe implements PipeTransform {

  constructor(private userProfileService: UserProfileService,
              private campaignService: CampaignService) {

  }

  transform(value: any, ...args: any[]): any {
    const members = this.campaignService.members;
    for (let member of members) {
      if (member._id === this.userProfileService.getUserId()) {
        return true;
      }
    }

    return false;
  }
}