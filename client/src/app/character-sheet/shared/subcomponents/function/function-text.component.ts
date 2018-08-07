import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CharacterInterfaceService } from '../../character-interface.service';
import { CharacterInterfaceFactory } from '../../character-interface.factory';
import { RuleFunction } from './rule-function';

@Component({
	templateUrl: 'function-text.component.html',
	styleUrls: ['function-text.component.scss'],
})
export class FunctionTextComponent {
	public functionText: string;

	private readonly characterService: CharacterInterfaceService;

	constructor(private dialogRef: MatDialogRef<FunctionTextComponent>,
	            characterInterfaceFactory: CharacterInterfaceFactory,
	            @Inject(MAT_DIALOG_DATA) data: any) {
		this.functionText = data.ruleFunction;
		this.characterService = characterInterfaceFactory.getCharacterInterface();
	}

	submit(): void {
		this.dialogRef.close(new RuleFunction(this.functionText, this.characterService));
	}
}
