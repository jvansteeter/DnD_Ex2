import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CharacterRepository } from '../../../repositories/character.repository';
import { CharacterData } from '../../../../../../shared/types/character.data';

@Component({
	templateUrl: 'new-character-dialog.component.html',
	styleUrls: ['new-character-dialog.component.scss']
})
export class NewCharacterDialogComponent {
	public characterSheets: any[];
	private npcLabel: string;
	private isNpc: boolean;
	private characterSheetId: string;
	private campaignId?: string;

	constructor(private dialogRef: MatDialogRef<NewCharacterDialogComponent>,
	            @Inject(MAT_DIALOG_DATA) private data: any,
	            private characterRepo: CharacterRepository) {
		this.characterSheets = data.characterSheets;
		this.isNpc = data.isNpc;
		if (data.campaignId) {
			this.campaignId = data.campaignId;
		}
	}

	createNewNpc(): void {
		if (!this.npcLabel || !this.characterSheetId) {
			return;
		}

		this.characterRepo.createNewCharacter(this.npcLabel, this.characterSheetId, this.isNpc, this.campaignId).subscribe((npc: CharacterData) => {
			this.dialogRef.close(npc);
		});
	}
}
