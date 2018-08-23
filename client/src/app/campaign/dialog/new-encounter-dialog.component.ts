import { Component, ElementRef, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { CampaignPageService } from '../campaign-page.service';
import { isUndefined } from 'util';


@Component({
	templateUrl: 'new-encounter-dialog.component.html',
	styleUrls: ['new-encounter-dialog.component.scss']
})
export class NewEncounterDialogComponent {
	public encounterLabel: string;
	private mapUrl: string;
	public mapWidth: number;
	public mapHeight: number;

	@ViewChild('fileInput')
	fileInput: ElementRef;

	private reader: FileReader = new FileReader();

	constructor(private campaignService: CampaignPageService,
	            private dialogRef: MatDialogRef<NewEncounterDialogComponent>) {

	}

	public createEncounter(): void {
		if (this.encounterLabel && (!isUndefined(this.mapUrl) || (this.mapWidth > 0 && this.mapHeight > 0))) {
			this.campaignService.createEncounter(this.encounterLabel, this.mapWidth, this.mapHeight, this.mapUrl);
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
