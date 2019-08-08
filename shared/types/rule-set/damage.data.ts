import { DamageTypeData } from './damage-type.data';

export interface DamageData {
	amount: number;
	type?: DamageTypeData;
}