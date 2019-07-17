export interface RuleData {
	name: string;
	description: string;
	effects: {
		aspectLabel: string,
		aspectItem?: string,
		modFunction: string,
		result?: any
	}[];
}