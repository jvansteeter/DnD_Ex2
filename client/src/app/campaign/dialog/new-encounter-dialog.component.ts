import { Component, Renderer2 } from "@angular/core";
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

	private imageReader: FileReader = new FileReader();
	private jsonReader: FileReader = new FileReader();

	constructor(private campaignService: CampaignPageService,
	            private renderer: Renderer2,
	            private dialogRef: MatDialogRef<NewEncounterDialogComponent>) {

	}

	public createEncounter(): void {
		if (this.encounterLabel && (!isUndefined(this.mapUrl) || (this.mapWidth > 0 && this.mapHeight > 0))) {
			this.campaignService.createEncounter(this.encounterLabel, 50, this.mapWidth, this.mapHeight, this.mapUrl);
			this.dialogRef.close();
		}
	}

	public uploadImage(): void {
		let imageInputElement = this.renderer.createElement('input');
		this.renderer.setAttribute(imageInputElement, 'type', 'file');
		this.renderer.setAttribute(imageInputElement, 'accept', 'image/*');
		this.renderer.listen(imageInputElement, 'change', () => {
			this.imageReader.addEventListener('load', () => {
				this.mapUrl = String(this.imageReader.result);
			});
			if (imageInputElement.files[0]) {
				this.imageReader.readAsDataURL(imageInputElement.files[0]);
			}
		});
		imageInputElement.click();
	}

	public uploadImportJson(): void {
		let jsonInputElement = this.renderer.createElement('input');
		this.renderer.setAttribute(jsonInputElement, 'type', 'file');
		this.renderer.setAttribute(jsonInputElement, 'accept', '.encounter.json');
		this.renderer.listen(jsonInputElement, 'change', () => {
			this.jsonReader.addEventListener('load', () => {
				const importJson = JSON.parse(this.jsonReader.result);
				this.campaignService.createEncounterFromJson(importJson).subscribe(() => {
					this.dialogRef.close();
				})
			});
			if (jsonInputElement.files[0]) {
				this.jsonReader.readAsText(jsonInputElement.files[0]);
			}
		});
		jsonInputElement.click();
	}
}
