export interface EncounterTeamsData {
	teams: string[];
	users: {
		userId: string,
		username: string,
		teams: string[],
	}[];
}
