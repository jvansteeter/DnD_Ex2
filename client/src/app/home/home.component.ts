import { NewRuleSetDialogComponent } from './dialog/new-rule-set-dialog.component';
import { UserProfileService } from '../data-services/userProfile.service';
import { SubjectDataSource } from '../utilities/subjectDataSource';
import { RuleSetRepository } from '../repositories/rule-set.repository';
import { NewCampaignDialogComponent } from './dialog/new-campaign-dialog.component';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DashboardCard } from '../cdk/dashboard-card/dashboard-card';
import { AddFriendComponent } from '../social/add-friend/add-friend.component';
import { UserProfile } from '../types/userProfile';
import { FriendService } from '../data-services/friend.service';
import { CampaignService } from '../data-services/campaign.service';
import { RuleSetData } from '../../../../shared/types/rule-set/rule-set.data';
import { CampaignData } from '../../../../shared/types/campaign.data';
import { BreadCrumbService } from '../bread-crumb/bread-crumb.service';

@Component({
	selector: 'home-page',
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
	@ViewChild('fileInput', {static: true}) fileInput: ElementRef;
	private imageReader: FileReader = new FileReader();
	private jsonReader: FileReader = new FileReader();
	private profilePhotoUrl: string = '';

	public ruleSets: RuleSetData[];
	public ruleSetTableColumns = ['label', 'options'];
	private readonly ruleSetSubject: Subject<RuleSetData[]>;
	private ruleSetDataSource: SubjectDataSource<RuleSetData>;

	public campaignTableColumns = ['label', 'options'];

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
	            private renderer: Renderer2,
	            public campaignService: CampaignService,
	            private breadCrumbService: BreadCrumbService) {
		this.ruleSetSubject = new Subject<RuleSetData[]>();
		this.ruleSetDataSource = new SubjectDataSource(this.ruleSetSubject);
		this.friendDataSource = new SubjectDataSource(this.friendService.getFriendsSubject());
	}

	public ngOnInit(): void {
		this.breadCrumbService.clearCrumbs();
		this.userProfileService.isReadyObservable.subscribe((isReady: boolean) => {
			if (isReady) {
				this.profilePhotoUrl = this.userProfileService.profilePhotoUrl;
			}
		});
		this.getRuleSets();
		this.getCampaigns();

		this.ruleSetCard = {
			menuOptions: [
				{
					label: 'New Rule Set',
					function: this.newRuleSet
				},
				{
					label: 'Import from file',
					function: this.importRuleSet
				},
			]
		};
		this.campaignCard = {
			menuOptions: [
				{
					label: 'New Campaign',
					function: this.newCampaign
				}
			]
		};
		this.friendsCard = {
			menuOptions: [
				{
					label: 'Find Friend',
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
		this.imageReader.addEventListener('load', () => {
			this.profilePhotoUrl = String(this.imageReader.result);
			this.userProfileService.setProfilePhotoUrl(this.profilePhotoUrl);
		});
		if (this.fileInput.nativeElement.files[0]) {
			this.imageReader.readAsDataURL(this.fileInput.nativeElement.files[0]);
		}
	}

	public deleteRuleSet(ruleSet: RuleSetData): void {
		this.ruleSetRepository.deleteRuleSet(ruleSet._id).subscribe(() => {
			this.getRuleSets();
			this.getCampaigns();
		});
	}

	private getRuleSets(): void {
		this.ruleSetRepository.getRuleSets().subscribe((ruleSets: RuleSetData[]) => {
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
		this.dialog.open(NewCampaignDialogComponent, {
			data: {
				ruleSets: this.ruleSets
			}
		}).componentInstance.getNewCampaignObservable().subscribe(() => {
			this.getCampaigns();
		});
	};

	public deleteCampaign(campaign: CampaignData): void {
		this.campaignService.deleteCampaign(campaign._id).subscribe(() => {
			this.getCampaigns();
		});
	}

	private openFriendInviteDialog = () => {
		this.dialog.open(AddFriendComponent);
	};

	private importRuleSet = () => {
		let inputTag = this.renderer.createElement('input');
		this.renderer.setAttribute(inputTag, 'type', 'file');
		this.renderer.setAttribute(inputTag, 'accept', '.json');
		this.renderer.listen(inputTag, 'change', () => {
			this.jsonReader.addEventListener('load', () => {
				this.ruleSetRepository.importRuleSetFromJson(this.jsonReader.result).subscribe(() => {
					this.getRuleSets();
				});
			});
			if (inputTag.files[0]) {
				this.jsonReader.readAsText(inputTag.files[0]);
			}
		});
		inputTag.click();
	};
}
