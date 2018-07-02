import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { CampaignPageService } from '../campaign-page.service';


@Component({
    templateUrl: 'new-encounter-dialog.component.html'
})
export class NewEncounterDialogComponent {
    public encounterLabel: string;

    constructor(private campaignService: CampaignPageService,
                private dialogRef: MatDialogRef<NewEncounterDialogComponent>) {

    }

    public createEncounter(): void {
        this.campaignService.createEncounter(this.encounterLabel);
        this.dialogRef.close();
    }
}
