import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RuleSetRepository } from '../../../repositories/rule-set.repository';

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
                private ruleSetRepository: RuleSetRepository) {
        this.characterSheets = data.characterSheets;
    }

    createNewNpc(): void {
        if (!this.npcLabel || !this.characterSheetId) {
            return;
        }

        this.ruleSetRepository.createNewNpc(this.npcLabel, this.characterSheetId).subscribe((npc) => {
            this.dialogRef.close();
        });
    }
}
