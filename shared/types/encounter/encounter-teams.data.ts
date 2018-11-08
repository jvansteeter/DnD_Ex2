export interface EncounterTeamsData {
	teams: string[];
	users: [{
		userId: string,
		teams: string[],
	}];
}
