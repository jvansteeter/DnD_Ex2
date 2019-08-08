import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { RuleSetService } from '../../../data-services/ruleSet.service';
import { RulesConfigService } from '../../../data-services/rules-config.service';
import { DamageData } from '../../../../../../shared/types/rule-set/damage.data';

@Component({
	templateUrl: 'submit-damage-dialog.component.html',
	styleUrls: ['submit-damage-dialog.component.scss']
})
export class SubmitDamageDialogComponent implements OnInit {
	public damages: DamageData[];

	constructor(private dialogRef: MatDialogRef<SubmitDamageDialogComponent>,
	            public ruleSetService: RuleSetService,
	            public rulesConfigService: RulesConfigService) {
	}

	public ngOnInit(): void {
		this.damages = [];
		this.damages.push({amount: null});
	}

	public addDamageRow(): void {
		this.damages.push({amount: null});
	}

	public removeDamageRow(): void {
		this.damages.splice(this.damages.length - 1);
	}

	public submit(): void {
		this.dialogRef.close(this.damages);
	}
}
