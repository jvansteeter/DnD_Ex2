import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from '../types/userProfile';
import { AlertService } from '../alert/alert.service';
import { UserProfileService } from '../utilities/services/userProfile.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { SelectFriendsComponent } from '../social/select-friends/select-friends.component';
import { CampaignService } from './campaign.service';
import { NewEncounterDialogComponent } from './dialog/new-encounter-dialog.component';
import { SubjectDataSource } from '../utilities/subjectDataSource';
import { Encounter } from '../../../../shared/types/encounter';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { mergeMap, tap } from 'rxjs/operators';


@Component({
	selector: 'campaign-page',
	templateUrl: 'campaign.component.html',
	styleUrls: ['campaign.component.css']
})
export class CampaignComponent implements OnInit {
	private campaignId;

	public memberDataSource: MatTableDataSource<UserProfile>;
	public memberTableCols = ['users', 'gm'];

	public encounterDataSource: SubjectDataSource<Encounter>;
	public encounterTableCols = ['label', 'date'];
	public encounterSubject: BehaviorSubject<Encounter[]>;

	constructor(private activatedRoute: ActivatedRoute,
							private campaignService: CampaignService,
							private alertService: AlertService,
							private userProfileService: UserProfileService,
							private dialog: MatDialog,
							private router: Router) {
	}

	ngOnInit(): void {
		this.activatedRoute.params
		 .pipe(
		  tap((params) => {
				this.campaignId = params['campaignId'];
				this.campaignService.setCampaignId(this.campaignId);
			}),
			mergeMap(() => {
				return this.campaignService.isReady();
			})
		 ).subscribe((isReady: boolean) => {
			if (isReady) {
				this.memberDataSource = new MatTableDataSource(this.campaignService.members);
				this.initEncounterDataSource();
			}
		});
	}

	// public changeGameMaster(member: any): void {
	//   // make sure there is at least one game master left
	//   let remainingMaster = false;
	//   for (let i = 0; i < this.members.length; i++) {
	//     remainingMaster = remainingMaster || this.members[ i ].gameMaster;
	//   }
	//   if (!remainingMaster) {
	//     Observable.timer(100).subscribe(() => {
	//       member.gameMaster = true;
	//     });
	//     this.alertService.showAlert('There must be at least one game master');
	//   }
	// }

	public enterEncounter(encounter: Encounter): void {
		this.router.navigate(['encounter', encounter._id])
	}

	private initEncounterDataSource(): void {
		this.encounterSubject = new BehaviorSubject<Encounter[]>(this.campaignService.encounters);
		this.encounterDataSource = new SubjectDataSource<Encounter>(this.encounterSubject);
		this.campaignService.encounterObservable.subscribe((encounters: Encounter[]) => {
			this.encounterSubject.next(encounters);
		});
	}

	private inviteFriends = () => {
		let dialogRef = this.dialog.open(SelectFriendsComponent);
		dialogRef.componentInstance.friendsSelected.subscribe((friends: UserProfile[]) => {
			this.campaignService.sendInvitations(friends);
		});
	};

	public newEncounter(): void {
		this.dialog.open(NewEncounterDialogComponent);
	};
}
