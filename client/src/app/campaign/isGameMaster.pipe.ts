import { Pipe, PipeTransform } from '@angular/core';
import { UserProfileService } from '../data-services/userProfile.service';
import { CampaignPageService } from './campaign-page.service';

@Pipe({
  name: 'isGameMaster'
})
export class IsGameMasterPipe implements PipeTransform {

  constructor(private userProfileService: UserProfileService,
              private campaignService: CampaignPageService) {

  }

  transform(value: any, ...args: any[]): any {
    const members = this.campaignService.members;
    for (let member of members) {
      if (member._id === this.userProfileService.userId) {
        return true;
      }
    }

    return false;
  }
}