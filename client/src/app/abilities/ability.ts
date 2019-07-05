import { DieEquation } from './die-equation';

export class Ability {
	public name: string;
	public rolls: {
		name: string,
		equation: DieEquation,
	}[];
}