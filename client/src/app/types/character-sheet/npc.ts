import { CharacterSheet } from './characterSheet';
import { AspectValue } from './aspectValue';

export interface Npc {
    _id: string;
    label: string;
    characterSheet: CharacterSheet;
    ruleSetId: string;
    values: AspectValue[];
}