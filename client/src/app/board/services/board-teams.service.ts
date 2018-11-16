import { Injectable } from "@angular/core";
import { EncounterService } from "../../encounter/encounter.service";
import { UserProfileService } from "../../data-services/userProfile.service";
import { Player } from "../../encounter/player";
import { isUndefined } from "util";
import { IsReadyService } from "../../utilities/services/isReady.service";
import { UserProfile } from '../../types/userProfile';
import { SocialRepository } from '../../social/social.repository';
import { EncounterTeamsData } from '../../../../../shared/types/encounter/encounter-teams.data';

@Injectable()
export class BoardTeamsService extends IsReadyService {
	private _users: {userProfile: UserProfile, teams: string[]}[];

	constructor(
			private encounterService: EncounterService,
			private userProfileService: UserProfileService,
			private socialRepo: SocialRepository,
	) {
		super(encounterService, userProfileService);
		this.init();
	}

	public init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady && !this.isReady()) {
				console.log('boardTeamsService.init() -> isReady');
				this.initUsers();
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

	public isUserMemberOfTeam(userId: string, team: string): boolean {
		for (let user of this._users) {
			if (userId === user.userProfile._id) {
				for (let userTeam of user.teams) {
					if (team === userTeam) {
						return true;
					}
				}
			}
		}

		return false;
	}

	public setTeamsData(data: EncounterTeamsData): void {
		this.encounterService.teamsData = data;
		this.initUsers();
	}

	get teams(): string[] {
		return this.encounterService.teamsData.teams;
	}

	get users() {
		return this._users;
	}

	private initUsers(): void {
		let users = [];
		for (let userObj of this.encounterService.users) {
			this.socialRepo.getUserById(userObj.userId).subscribe((user: UserProfile) => {
				let unique = true;
				for (let _user of this._users) {
					if (user._id === _user.userProfile._id) {
						unique = false;
						break;
					}
				}

				if (unique) {
					users.push({
						userProfile: user,
						teams: userObj.teams,
					});
				}
			});
		}
		this._users = users;
	}
}