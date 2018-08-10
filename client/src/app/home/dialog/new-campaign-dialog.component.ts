import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CampaignRepository } from '../../repositories/campaign.repository';
import { Observable, Subject } from 'rxjs';
import { RuleSetData } from '../../../../../shared/types/rule-set/rule-set.data';

@Component({
    templateUrl: 'new-campaign-dialog.component.html',
    styleUrls: ['new-campaign-dialog.component.css']
})
export class NewCampaignDialogComponent implements OnInit {
    campaignLabel: string;
    selectedRuleSet;

    private newCampaignSubject: Subject<void> = new Subject<void>();

    constructor(private dialogRef: MatDialogRef<NewCampaignDialogComponent>,
                private campaignRepository: CampaignRepository) {
    }

    ngOnInit(): void {
        this.campaignLabel = '';
        this.selectedRuleSet = undefined;
    }

    public ruleSetSelected(ruleSet: RuleSetData): void {
        this.selectedRuleSet = ruleSet;
    }

    public createCampaign(): void {
        this.campaignRepository.createNewCampaign(this.campaignLabel, this.selectedRuleSet._id).subscribe(() => {
            this.newCampaignSubject.next();
            this.dialogRef.close();
        });
    }

    public getNewCampaignObservable(): Observable<void> {
        return this.newCampaignSubject.asObservable();
    }
}
