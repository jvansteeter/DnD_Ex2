import { UserProfile } from '../types/userProfile';
import { Encounter } from '../../../../shared/types/encounter';
import { Campaign } from '../../../../shared/types/campaign';

export class CampaignState implements Campaign {
  _id: string;
  label: string;
  ruleSetId: string;

  private _members: UserProfile[];
  private _encounters: Encounter[];
  private _isGameMaster: boolean;

  constructor(campaign: Campaign) {
    this._id = campaign._id;
    this.label = campaign.label;
    this.ruleSetId = campaign.ruleSetId;
    this._isGameMaster = false;
  }

  get members(): UserProfile[] {
    return this._members;
  }

  set members(value: UserProfile[]) {
    this._members = value;
  }

  get encounters(): Encounter[] {
    return this._encounters;
  }

  set encounters(value: Encounter[]) {
    this._encounters = value;
  }
}
