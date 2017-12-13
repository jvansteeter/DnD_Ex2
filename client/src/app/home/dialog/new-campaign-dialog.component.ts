import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CampaignRepository } from '../../repositories/campaign.repository';
import { RuleSet } from '../../types/RuleSet';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
    templateUrl: 'new-campaign-dialog.component.html',
    styleUrls: ['new-campaign-dialog.component.css']
})
export class NewCampaignDialogComponent implements OnInit {
    campaignLabel: string;
    selectedRuleSet;

    private newCampaignSubject: Subject<void>;

    constructor(private dialogRef: MatDialogRef<NewCampaignDialogComponent>,
                private campaignRepository: CampaignRepository) {
    }

    ngOnInit(): void {
        this.campaignLabel = '';
        this.selectedRuleSet = undefined;
        this.newCampaignSubject = new Subject<void>();
    }

    ruleSetSelected(ruleSet: RuleSet): void {
        this.selectedRuleSet = ruleSet;
    }

    createCampaign(): void {
        this.campaignRepository.createNewCampaign(this.campaignLabel, this.selectedRuleSet._id).subscribe((campaign: any) => {
            console.log('new campaign created')
            this.campaignRepository.joinCampaign(campaign._id).subscribe(() => {
                console.log('campaigns joined')
                this.newCampaignSubject.next();
                this.dialogRef.close();
            });
        });
    }

    public getNewCampaignObservable(): Observable<void> {
        return this.newCampaignSubject.asObservable();
    }
}
