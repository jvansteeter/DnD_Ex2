import { Component, OnDestroy, OnInit } from '@angular/core';
import { EncounterService } from '../../../encounter/encounter.service';
import { Player } from '../../../encounter/player';
import { SocialRepository } from '../../../social/social.repository';
import { UserProfile } from '../../../types/userProfile';
import { SubjectDataSource } from '../../../utilities/subjectDataSource';
import { Subject, Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Component({
	templateUrl: 'team-settings.component.html',
	styleUrls: ['team-settings.component.scss']
})
export class TeamSettingsComponent implements OnInit, OnDestroy {
	public tokenTableCols = ['token'];
	public userTableCols = ['user'];
	public newTeam: string = '';
	private users: {userProfile: UserProfile, teams: string[]}[];
	public userDataSource: SubjectDataSource<{userProfile: UserProfile, teams: string[]}>;
	private usersSubject: Subject<{userProfile: UserProfile, teams: string[]}[]>;
	private teamsChangeSub: Subscription;

	constructor(public encounterService: EncounterService,
	            private socialRepo: SocialRepository) {}

	public ngOnInit(): void {
		this.usersSubject = new Subject();
		this.userDataSource = new SubjectDataSource<{userProfile: UserProfile, teams: string[]}>(this.usersSubject);
		this.tokenTableCols.push(...this.encounterService.teams);
		this.userTableCols.push(...this.encounterService.teams);
		this.initUsers();
	}

	public ngOnDestroy(): void {
		if (this.teamsChangeSub) {
			this.teamsChangeSub.unsubscribe();
		}
	}

	public toggleTokenTeam(player: Player, team: string): void {
		player.toggleTeam(team);
	}

	public toggleUserTeam(user, team: string): void {
		this.encounterService.toggleUserTeam(user.userProfile._id, team);
	}

	public addTeam(): void {
		if (isNullOrUndefined(this.newTeam) || this.newTeam === '') {
			return;
		}
		for (let existingTeam of this.encounterService.teams) {
			if (this.newTeam === existingTeam) {
				this.newTeam = '';
				return;
			}
		}
		this.encounterService.addTeam(this.newTeam);
		this.tokenTableCols.push(this.newTeam);
		this.userTableCols.push(this.newTeam);
		this.newTeam = '';
	}

	public removeTeam(team): void {
		this.encounterService.removeTeam(team);
		for (let i = 0; i < this.tokenTableCols.length; i++) {
			if (team === this.tokenTableCols[i]) {
				this.tokenTableCols.splice(i, 1);
				this.userTableCols.splice(i, 1);
				return;
			}
		}
	}

	public isUserMemberOfTeam(userId: string, team: string): boolean {
		for (let user of this.users) {
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

	private initUsers(): void {
		this.users = [];
		for (let userObj of this.encounterService.users) {
			this.socialRepo.getUserById(userObj.userId).subscribe((user: UserProfile) => {
				this.users.push({
					userProfile: user,
					teams: userObj.teams,
				});
				this.usersSubject.next(this.users);
			});
		}
	}
}
