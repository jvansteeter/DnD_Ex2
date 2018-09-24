import { UserProfile } from '../types/userProfile';
import { CampaignData } from '../../../../shared/types/campaign.data';
import { EncounterData } from '../../../../shared/types/encounter/encounter.data';
import { CharacterData } from '../../../../shared/types/character.data';
import { isUndefined } from 'util';

export class CampaignState implements CampaignData {
  _id: string;
  label: string;
  ruleSetId: string;

  private _members: UserProfile[];
  private _encounters: EncounterData[];
  private _characters: CharacterData[];

  constructor(campaign: CampaignData) {
    this._id = campaign._id;
    this.label = campaign.label;
    this.ruleSetId = campaign.ruleSetId;
  }

  public getEncounter(encounterId: string): EncounterData {
  	if (isUndefined(this._encounters)) {
  		return undefined;
	  }
  	for (let encounter of this._encounters) {
  		if (encounterId === encounter._id) {
  			return encounter;
		  }
	  }

	  return undefined;
  }

  get members(): UserProfile[] {
  	if (isUndefined(this._members)) {
  		return [];
	  }
    return this._members;
  }

  set members(value: UserProfile[]) {
    this._members = value;
  }

  get encounters(): EncounterData[] {
    return this._encounters;
  }

  set encounters(value: EncounterData[]) {
    this._encounters = value;
  }

  get characters(): CharacterData[] {
  	return this._characters;
  }

  set characters(value: CharacterData[]) {
  	this._characters = value;
  }
}
