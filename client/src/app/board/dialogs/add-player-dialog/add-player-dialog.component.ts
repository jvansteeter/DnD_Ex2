import { Component, Inject, OnInit } from '@angular/core';
import { CharacterRepository } from '../../../repositories/character.repository';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { CharacterData } from '../../../../../../shared/types/character.data';
import { SelectionModel } from '@angular/cdk/collections';
import { EncounterService } from '../../../encounter/encounter.service';
import { AlertService } from "../../../alert/alert.service";
import { isNullOrUndefined } from "util";
import { RightsService } from '../../../data-services/rights.service';

@Component({
	templateUrl: 'add-player-dialog.component.html',
	styleUrls: ['add-player-dialog.component.scss']
})
export class AddPlayerDialogComponent implements OnInit {
	private campaignId: string;
	public hasCampaignCharacters: boolean = false;
	public hasCampaignNPCs: boolean = false;
	public hasRuleSetNPCs: boolean = false;

	public selection = new SelectionModel<CharacterData>(true, []);

	public campaignCharacterDataSource: MatTableDataSource<CharacterData>;
	public ruleSetNPCDataSource: MatTableDataSource<CharacterData>;
	public characterTableColumns = ['check', 'label', 'count'];

	private counts: Map<CharacterData, number>;

	constructor(@Inject(MAT_DIALOG_DATA) data: any,
	            private characterRepo: CharacterRepository,
	            private encounterService: EncounterService,
	            private dialogRef: MatDialogRef<AddPlayerDialogComponent>,
	            private alertService: AlertService,
	            public rightsService: RightsService,
	            ) {
		this.campaignId = data.campaignId;
		this.counts = new Map<CharacterData, number>();
	}

	public ngOnInit(): void {
		this.characterRepo.getAllByCampaignId(this.campaignId).subscribe((data) => {
			if (data.campaignCharacters.length > 0) {
				this.hasCampaignCharacters = true;
				this.campaignCharacterDataSource = new MatTableDataSource<CharacterData>(data.campaignCharacters);
			}
			if (data.ruleSetNPCs.length > 0) {
				this.hasRuleSetNPCs = true;
				this.ruleSetNPCDataSource = new MatTableDataSource<CharacterData>(data.ruleSetNPCs);
			}
		});
	}

	public toggleCheckbox(character: CharacterData): void {
		this.selection.toggle(character);
		if (this.selection.isSelected(character)) {
			this.counts.set(character, 1);
		}
		else {
			this.counts.set(character, undefined);
		}
	}

	public incrementCount(character: CharacterData): void {
		this.counts.set(character, this.counts.get(character) + 1);
	}

	public decrementCount(character: CharacterData): void {
		let count = this.counts.get(character) - 1;
		if (count >= 0) {
			this.counts.set(character, count);
		}
	}

	public inputChange(character: CharacterData, value: string): void {
		let count: number = Number(value);
		this.counts.set(character, count);
	}

	public submit(): void {
		let characters: CharacterData[] = [];
		if (!this.selection.isEmpty()) {
			for (let selectedCharacter of this.selection.selected) {
				let count = this.counts.get(selectedCharacter);
				for (let i = 0; i < count; i++) {
					if (isNullOrUndefined(selectedCharacter.tokenUrl) || selectedCharacter.tokenUrl === '') {
						this.alertService.showAlert('Cannot add a character that does not have a map token');
						return;
					}
					characters.push(JSON.parse(JSON.stringify(selectedCharacter)));
				}
			}

			this.encounterService.addCharacters(characters).subscribe(() => {
				this.dialogRef.close();
			});
		}
		else {
			this.dialogRef.close();
		}
	}
}
