import { Injectable } from "@angular/core";
import { EncounterService } from "../../encounter/encounter.service";
import { UserProfileService } from "../../data-services/userProfile.service";
import { Player } from "../../encounter/player";
import { isUndefined } from "util";
import { IsReadyService } from "../../utilities/services/isReady.service";
import { EncounterTeamsData } from '../../../../../shared/types/encounter/encounter-teams.data';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class BoardTeamsService extends IsReadyService {
	private teamsChangedSubject: Subject<void>;

	constructor(
			private encounterService: EncounterService,
			private userProfileService: UserProfileService,
	) {
		super(encounterService, userProfileService);
		this.init();
		this.teamsChangedSubject = new Subject<void>();
	}

	public init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady && !this.isReady()) {
				this.encounterService.addPlayerObservable.subscribe(() => {
					this.teamsChangedSubject.next();
				});
				console.log('boardTeamsService.init() -> isReady');
				this.setReady(true);
			}
		})
	}

	public unInit(): void {
		console.log('boardTeamsService.unInit()');
		super.unInit();
		if (this.dependenciesSub) {
			this.dependenciesSub.unsubscribe();
		}
	}

	public toggleUserTeam(userId: string, team: string): void {
		this.encounterService.toggleUserTeam(userId, team);
		this.teamsChangedSubject.next();
	}

	public addTeam(teamName: string): void {
		this.encounterService.addTeam(teamName);
	}

	public removeTeam(teamName: string): void {
		this.encounterService.removeTeam(teamName);
		this.teamsChangedSubject.next();
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

	public getAllPlayersOnMyTeams(): Player[] {
		const teamPlayers = [];
		let userTeams: string[];
		for (let user of this.encounterService.teamsData.users) {
			if (user.userId === this.userProfileService.userId) {
				userTeams = user.teams;
			}
		}

		for (let player of this.encounterService.players) {
			let playerTeams = player.teams;
			for (let userTeam of userTeams) {
				if (playerTeams.includes(userTeam)) {
					teamPlayers.push(player);
				}
			}
		}

		return teamPlayers;
	}

	public setTeamsData(data: EncounterTeamsData): void {
		this.encounterService.teamsData = data;
		this.teamsChangedSubject.next();
	}

	get teams(): string[] {
		return this.encounterService.teamsData.teams;
	}

	get users() {
		return this.encounterService.users;
	}

	get teamsChangedObservable(): Observable<void> {
		return this.teamsChangedSubject.asObservable();
	}
}