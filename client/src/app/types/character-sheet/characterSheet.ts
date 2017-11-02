import { Aspect } from './aspect';

export interface CharacterSheet {
    _id: string;
    ruleSetId: string;
    label: string;
    aspects: Aspect[];
}