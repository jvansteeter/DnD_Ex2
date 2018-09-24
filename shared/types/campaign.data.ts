import { UserProfile } from '../../client/src/app/types/userProfile';
import { EncounterData } from './encounter/encounter.data';
import { CharacterData } from './character.data';

export interface CampaignData {
    _id: string;
    label: string;
    ruleSetId: string;
    members?: UserProfile[];
    gameMasters?: string[];
    encounters?: EncounterData[];
    characters?: CharacterData[];
}