import { DamageTypeData } from './rule-set/damage-type.data';

export interface ResistanceData {
	damageType: DamageTypeData;
	percent: number;
}
