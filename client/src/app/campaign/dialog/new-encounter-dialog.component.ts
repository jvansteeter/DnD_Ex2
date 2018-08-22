import { Component, ElementRef, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { CampaignPageService } from '../campaign-page.service';


@Component({
	templateUrl: 'new-encounter-dialog.component.html',
	styleUrls: ['new-encounter-dialog.component.scss']
})
export class NewEncounterDialogComponent {
	public encounterLabel: string;
	private mapUrl: string;

	@ViewChild('fileInput')
	fileInput: ElementRef;

	private reader: FileReader = new FileReader();

	constructor(private campaignService: CampaignPageService,
	            private dialogRef: MatDialogRef<NewEncounterDialogComponent>) {

	}

	public createEncounter(): void {
		if (this.encounterLabel) {
			this.campaignService.createEncounter(this.encounterLabel, this.mapUrl);
			this.dialogRef.close();
		}
	}

	public upload(): void {
		this.fileInput.nativeElement.click();
	}

	public loadImage(): void {
		this.reader.addEventListener('load', () => {
			this.mapUrl = String(this.reader.result);
		});
		if (this.fileInput.nativeElement.files[0]) {
			this.reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
		}
	}
}
