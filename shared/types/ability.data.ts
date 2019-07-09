export interface AbilityData {
	name: string;
	range: number;
	rolls: {
		name: string,
		equation: string,
		result?: string
	}[];
}