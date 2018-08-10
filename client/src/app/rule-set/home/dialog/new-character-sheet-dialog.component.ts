import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CharacterSheetData } from '../../../../../../shared/types/rule-set/character-sheet.data';

@Component({
	templateUrl: 'new-character-sheet-dialog.component.html'
})
export class NewCharacterSheetDialogComponent {
	public characterSheetLabel: string;

	constructor(private http: HttpClient,
	            private dialogRef: MatDialogRef<NewCharacterSheetDialogComponent>,
	            @Inject(MAT_DIALOG_DATA) private data: any) {
	}

	public createNewCharacterSheet(): void {
		let body = {
			ruleSetId: this.data.ruleSetId,
			label: this.characterSheetLabel
		};
		this.http.post<CharacterSheetData>('api/ruleset/new/charactersheet', body, {responseType: 'json'}).subscribe((characterSheet: CharacterSheetData) => {
			this.dialogRef.close(characterSheet);
		});
	}
}
