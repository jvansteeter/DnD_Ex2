import {Component, ElementRef, ViewChild} from '@angular/core';
import {EncounterService} from "../encounter/encounter.service";
import { PlayerData } from "../../../../shared/types/encounter/player";
import { MatDialogRef } from "@angular/material";

@Component({
	templateUrl: 'add-player.component.html'
})
export class AddPlayerComponent {
	@ViewChild('tokenImport') tokenImport: ElementRef;
	private fileReader: FileReader = new FileReader();

	public name: String;
	public hp: number;
	public speed: number;

	constructor(private encounterService: EncounterService,
	            private dialogRef: MatDialogRef<AddPlayerComponent>) {

	}

	submit(): void {
		this.fileReader.addEventListener('load', () => {
			this.encounterService.addPlayer({
				name: this.name,
				tokenUrl: this.fileReader.result,
				maxHp: this.hp,
				hp: this.hp,
				speed: this.speed,
				location: {}
			} as PlayerData).subscribe(() => this.dialogRef.close());
		});
		if (this.tokenImport.nativeElement.files[0]) {
			this.fileReader.readAsDataURL(this.tokenImport.nativeElement.files[0]);
		}
	}
}