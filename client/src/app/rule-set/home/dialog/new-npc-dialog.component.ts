import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CharacterRepository } from '../../../repositories/character.repository';
import { CharacterData } from '../../../../../../shared/types/character.data';

@Component({
	templateUrl: 'new-npc-dialog.component.html',
	styleUrls: ['new-npc-dialog.component.scss']
})
export class NewNpcDialogComponent {
	public characterSheets: any[];
	private npcLabel: string;
	private characterSheetId: string;

	constructor(private dialogRef: MatDialogRef<NewNpcDialogComponent>,
	            @Inject(MAT_DIALOG_DATA) private data: any,
	            private characterRepo: CharacterRepository) {
		this.characterSheets = data.characterSheets;
	}

	createNewNpc(): void {
		if (!this.npcLabel || !this.characterSheetId) {
			return;
		}

		this.characterRepo.createNewCharacter(this.npcLabel, this.characterSheetId, true).subscribe((npc: CharacterData) => {
			this.dialogRef.close(npc);
		});
	}
}
