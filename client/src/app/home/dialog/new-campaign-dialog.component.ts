import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CampaignRepository } from '../../repositories/campaign.repository';
import { Observable, Subject } from 'rxjs';
import { RuleSetData } from '../../../../../shared/types/rule-set/rule-set.data';
import { isUndefined } from 'util';

@Component({
	templateUrl: 'new-campaign-dialog.component.html',
	styleUrls: ['new-campaign-dialog.component.scss']
})
export class NewCampaignDialogComponent implements OnInit {
	public campaignLabel: string;
	public selectedRuleSetId: string;
	public ruleSets: RuleSetData[];

	private newCampaignSubject: Subject<void> = new Subject<void>();

	constructor(@Inject(MAT_DIALOG_DATA) private data: any,
	            private dialogRef: MatDialogRef<NewCampaignDialogComponent>,
	            private campaignRepository: CampaignRepository) {
		this.ruleSets = data.ruleSets;
	}

	ngOnInit(): void {
		this.campaignLabel = '';
		this.selectedRuleSetId = undefined;
	}

	public submit(): void {
		if (!isUndefined(this.campaignLabel) && ! isUndefined(this.selectedRuleSetId)) {
			this.campaignRepository.createNewCampaign(this.campaignLabel, this.selectedRuleSetId).subscribe(() => {
				this.newCampaignSubject.next();
				this.dialogRef.close();
			});
		}
	}

	public getNewCampaignObservable(): Observable<void> {
		return this.newCampaignSubject.asObservable();
	}
}
