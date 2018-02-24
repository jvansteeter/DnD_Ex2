import { Component } from "@angular/core";
import { CampaignService } from "../campaign.service";
import { MatDialogRef } from "@angular/material";


@Component({
    templateUrl: 'new-encounter-dialog.component.html'
})
export class NewEncounterDialogComponent {
    public encounterLabel: string;

    constructor(private campaignService: CampaignService,
                private dialogRef: MatDialogRef<NewEncounterDialogComponent>) {

    }

    public createEncounter(): void {
        this.campaignService.createEncounter(this.encounterLabel);
        this.dialogRef.close();
    }
}
