export interface AbilityData {
	name: string;
	rolls: {
		name: string,
		equation: string,
		result?: string
	}[];
}