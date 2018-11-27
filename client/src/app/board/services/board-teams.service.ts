import { Injectable } from "@angular/core";
import { EncounterService } from "../../encounter/encounter.service";
import { UserProfileService } from "../../data-services/userProfile.service";
import { Player } from "../../encounter/player";
import { isUndefined } from "util";
import { IsReadyService } from "../../utilities/services/isReady.service";
import { EncounterTeamsData } from '../../../../../shared/types/encounter/encounter-teams.data';

@Injectable()
export class BoardTeamsService extends IsReadyService {
	constructor(
			private encounterService: EncounterService,
			private userProfileService: UserProfileService,
	) {
		super(encounterService, userProfileService);
		this.init();
	}

	public init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady && !this.isReady()) {
				console.log('boardTeamsService.init() -> isReady');
				this.setReady(true);
			}
		})
	}

	public unInit(): void {
		console.log('boardTeamsService.unInit()');
		super.unInit();
	}

	public toggleUserTeam(userId: string, team: string): void {
		this.encounterService.toggleUserTeam(userId, team);
	}

	public addTeam(teamName: string): void {
		this.encounterService.addTeam(teamName);
	}

	public removeTeam(teamName: string): void {
		this.encounterService.removeTeam(teamName);
	}

	public userSharesTeamWithPlayer(player: Player): boolean {
		let userTeams;
		for (let user of this.encounterService.teamsData.users) {
			if (user.userId === this.userProfileService.userId) {
				userTeams = user.teams;
			}
		}

		if (isUndefined(userTeams)) {
			return false;
		}

		let playerTeams = player.teams;
		for (let userTeam of userTeams) {
			for (let playerTeam of playerTeams) {
				if (userTeam === playerTeam) {
					return true;
				}
			}
		}

		return false;
	}

	public setTeamsData(data: EncounterTeamsData): void {
		this.encounterService.teamsData = data;
	}

	get teams(): string[] {
		return this.encounterService.teamsData.teams;
	}

	get users() {
		return [];
	}
}