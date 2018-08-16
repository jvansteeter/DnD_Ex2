import {NewRuleSetDialogComponent} from './dialog/new-rule-set-dialog.component';
import {UserProfileService} from '../data-services/userProfile.service';
import {SubjectDataSource} from '../utilities/subjectDataSource';
import {RuleSetRepository} from '../repositories/rule-set.repository';
import {NewCampaignDialogComponent} from './dialog/new-campaign-dialog.component';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {DashboardCard} from '../cdk/dashboard-card/dashboard-card';
import {AddFriendComponent} from '../social/add-friend/add-friend.component';
import {UserProfile} from '../types/userProfile';
import {FriendService} from '../data-services/friend.service';
import { CampaignService } from '../data-services/campaign.service';

@Component({
	selector: 'home-page',
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
	@ViewChild('fileInput') fileInput: ElementRef;
	private reader: FileReader = new FileReader();
	private profilePhotoUrl: string = '';

	public ruleSets: any[];
	public ruleSetTableColumns = ['label'];
	private readonly ruleSetSubject: Subject<any>;
	private ruleSetDataSource: SubjectDataSource<any>;

	public campaignTableColumns = ['label'];

	public ruleSetCard: DashboardCard;
	public campaignCard: DashboardCard;
	public friendsCard: DashboardCard;

	public friendTableColumns = ['label'];
	public friendDataSource: SubjectDataSource<UserProfile>;

	constructor(private dialog: MatDialog,
	            private router: Router,
	            private userProfileService: UserProfileService,
	            private ruleSetRepository: RuleSetRepository,
	            private friendService: FriendService,
	            public campaignService: CampaignService) {
		this.ruleSetSubject = new Subject<any>();
		this.ruleSetDataSource = new SubjectDataSource(this.ruleSetSubject);
		this.friendDataSource = new SubjectDataSource(this.friendService.getFriendsSubject());
	}

	public ngOnInit(): void {
		this.userProfileService.isReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.profilePhotoUrl = this.userProfileService.profilePhotoUrl;
			}
		});
		this.getRuleSets();
		this.getCampaigns();

		this.ruleSetCard = {
			menuOptions: [
				{
					title: 'New Rule Set',
					function: this.newRuleSet
				}
			]
		};
		this.campaignCard = {
			menuOptions: [
				{
					title: 'New Campaign',
					function: this.newCampaign
				}
			]
		};
		this.friendsCard = {
			menuOptions: [
				{
					title: 'Find Friend',
					function: this.openFriendInviteDialog
				}
			]
		}
	}

	public ruleSetHome(ruleSetId: string): void {
		this.router.navigate(['rule-set', ruleSetId]);
	}

	public campaignHome(campaign: any) {
		this.router.navigate(['campaign', campaign._id]);
	}

	public upload(): void {
		this.fileInput.nativeElement.click();
	}

	public loadImage(): void {
		this.reader.addEventListener('load', () => {
			this.profilePhotoUrl = this.reader.result;
			this.userProfileService.setProfilePhotoUrl(this.profilePhotoUrl);
		});
		if (this.fileInput.nativeElement.files[0]) {
			this.reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
		}
	}

	private getRuleSets(): void {
		this.ruleSetRepository.getRuleSets().subscribe((ruleSets: any) => {
			this.ruleSets = ruleSets;
			this.ruleSetSubject.next(ruleSets);
		});
	}

	private getCampaigns(): void {
		this.campaignService.refreshCampaigns();
	}

	private newRuleSet = () => {
		this.dialog.open(NewRuleSetDialogComponent).afterClosed().subscribe(() => this.getRuleSets());
	};

	private newCampaign = () => {
		this.dialog.open(NewCampaignDialogComponent).componentInstance.getNewCampaignObservable().subscribe(() => {
			this.getCampaigns();
		});
	};

	private openFriendInviteDialog = () => {
		this.dialog.open(AddFriendComponent);
	}
}
