import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RuleSetHomeRepository } from '../rule-set-home.repository';

@Component({
    selector: '',
    templateUrl: 'new-npc-dialog.component.html'
})
export class NewNpcDialogComponent {
    private characterSheets: any[];
    private npcLabel: string;
    private characterSheetId: string;

    constructor(private dialogRef: MatDialogRef<NewNpcDialogComponent>,
                @Inject(MAT_DIALOG_DATA) private data: any,
                private ruleSetRepository: RuleSetHomeRepository) {
        this.characterSheets = data.characterSheets;
    }

    createNewNpc(): void {
        if (!this.npcLabel || !this.characterSheetId) {
            return;
        }

        this.ruleSetRepository.createNewNpc(this.npcLabel, this.characterSheetId).subscribe((npc) => {
            console.log(npc)
            this.dialogRef.close();
        });
    }
}
