import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CampaignRepository } from '../../repositories/campaign.repository';
import { RuleSet } from '../../types/RuleSet';
import { Observable, Subject } from 'rxjs';

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

    public ruleSetSelected(ruleSet: RuleSet): void {
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
