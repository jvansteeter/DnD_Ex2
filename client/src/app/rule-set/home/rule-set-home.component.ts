import * as FileSaver from 'file-saver';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { NewCharacterSheetDialogComponent } from './dialog/new-character-sheet-dialog.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { RuleSetRepository } from '../../repositories/rule-set.repository';
import { SubjectDataSource } from '../../utilities/subjectDataSource';
import { CharacterSheetData } from '../../../../../shared/types/rule-set/character-sheet.data';
import { DashboardCard } from '../../cdk/dashboard-card/dashboard-card';
import { NewCharacterDialogComponent } from './dialog/new-character-dialog.component';
import { CharacterRepository } from '../../repositories/character.repository';
import { CharacterData } from '../../../../../shared/types/character.data';
import { isUndefined } from 'util';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { filter, first, map, mergeMap, tap } from 'rxjs/operators';
import { NewDamageTypeDialogComponent } from './dialog/new-damage-type-dialog.component';
import { DamageTypeData } from '../../../../../shared/types/rule-set/damage-type.data';
import { SelectFriendsComponent } from '../../social/select-friends/select-friends.component';
import { UserProfile } from '../../types/userProfile';
import { NewConditionDialogComponent } from '../../conditions/new-condition-dialog.component';
import { ConditionData } from '../../../../../shared/types/rule-set/condition.data';
import { RuleSetService } from '../../data-services/ruleSet.service';
import { AlertService } from '../../alert/alert.service';
import { BreadCrumbService } from '../../bread-crumb/bread-crumb.service';
import { SubSink } from 'subsink';

@Component({
	selector: 'rule-set-home',
	templateUrl: 'rule-set-home.component.html',
	styleUrls: ['rule-set-home.component.scss']
})
export class RuleSetHomeComponent implements OnInit, OnDestroy {
	public characterSheets: CharacterSheetData[];
	public admins: any[];
	public configCard: DashboardCard;
	public adminsCard: DashboardCard;
	public adminColumns = ['username', 'role'];
	public characterSheetCard: DashboardCard;
	public characterSheetColumns = ['label', 'options'];
	public npcCard: DashboardCard;
	public npcDataSource: MatTableDataSource<NpcData>;
	public npcColumns = ['label', 'sheet', 'options'];
	public conditionsCard: DashboardCard;
	public damageTypesCard: DashboardCard;
	public conditions: ConditionData[];
	public damageTypes: DamageTypeData[];

	private subs: SubSink = new SubSink();
	private ruleSetId: string;
	private adminDataSource: SubjectDataSource<AdminData>;
	private characterSheetDataSource: SubjectDataSource<CharacterSheetData>;
	private readonly adminSubject: Subject<AdminData[]>;
	private readonly characterSheetSubject: BehaviorSubject<CharacterSheetData[]>;

	constructor(private activatedRoute: ActivatedRoute,
	            private dialog: MatDialog,
	            private router: Router,
	            private ruleSetRepository: RuleSetRepository,
	            private characterRepo: CharacterRepository,
	            private characterSheetRepo: CharacterSheetRepository,
	            private ruleSetService: RuleSetService,
	            private breadCrumbService: BreadCrumbService,
	            private alertService: AlertService) {
		this.adminSubject = new Subject<AdminData[]>();
		this.adminDataSource = new SubjectDataSource(this.adminSubject);

		this.configCard = {
			label: 'Rule Set Config'
		};
		this.adminsCard = {
			menuOptions: [
				{
					label: 'Add Admin',
					function: this.addAdmins
				}
			]
		};
		this.characterSheetCard = {
			menuOptions: [
				{
					label: 'New Character Sheet',
					function: this.newCharacterSheet
				}
			]
		};
		this.npcCard = {
			menuOptions: [
				{
					label: 'Create NPC',
					function: this.createNPC
				}
			]
		};
		this.conditionsCard = {
			label: 'Conditions',
			menuOptions: [
				{
					label: 'Add Condition',
					function: this.openNewConditionDialog
				}
			]
		};
		this.damageTypesCard = {
			label: 'Damage Types',
			menuOptions: [
				{
					label: 'New Damage Type',
					function: this.openNewDamageTypeDialog
				}
			]
		};

		this.characterSheetSubject = new BehaviorSubject<CharacterSheetData[]>([]);
		this.characterSheetDataSource = new SubjectDataSource<CharacterSheetData>(this.characterSheetSubject);

		this.npcDataSource = new MatTableDataSource();
	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params) => {
			this.ruleSetId = params['ruleSetId'];
			this.ruleSetService.setRuleSetId(this.ruleSetId);
			this.subs.add(this.ruleSetService.isReadyObservable.pipe(
					filter((isReady: boolean ) => isReady),
					mergeMap(() => {
						return this.ruleSetRepository.getCharacterSheets(this.ruleSetId);
					}),
					tap((characterSheets: CharacterSheetData[]) => {
						this.characterSheets = characterSheets;
						this.characterSheetSubject.next(characterSheets);
					}),
					tap(() => {
						this.getNPCs();
					}),
					mergeMap(() => {
						return this.ruleSetRepository.getAdmin(this.ruleSetId);
					})
			).subscribe((admins: any[]) => {
				this.admins = admins;
				this.conditions = this.ruleSetService.conditions;
				this.damageTypes = this.ruleSetService.damageTypes;
				this.adminSubject.next(admins);
				this.breadCrumbService.addCrumb(this.ruleSetService.label, `rule-set/${this.ruleSetId}`)
			}));
		});
	}

	public ngOnDestroy(): void {
		this.subs.unsubscribe();
	}

	private newCharacterSheet = () => {
		this.dialog.open(NewCharacterSheetDialogComponent, {data: {ruleSetId: this.ruleSetId}}).afterClosed().subscribe((characterSheet: CharacterSheetData) => {
			this.router.navigate(['character-sheet', characterSheet._id]);
		});
	};

	public editCharacterSheet(characterSheetId: string): void {
		this.router.navigate(['character-sheet', characterSheetId]);
	}

	public editNpc(npcId: string): void {
		this.router.navigate(['character', npcId]);
	}

	public deleteCharacter(npc: CharacterData): void {
		this.characterRepo.deleteCharacter(npc._id).subscribe(() => {
			this.ngOnInit();
		});
	}

	public deleteCharacterSheet(sheet: CharacterSheetData): void {
		this.characterSheetRepo.deleteCharacterSheet(sheet._id).subscribe(() => {
			this.ngOnInit();
		});
	}

	public exportRuleSet(): void {
		this.ruleSetRepository.getExportJson(this.ruleSetId).subscribe((data) => {
			FileSaver.saveAs(new Blob([JSON.stringify(data)], {type: 'application/json'}), !isUndefined(data['label']) ? data['label'] : 'ruleSet' + '.json');
		});
	}

	public changeModulesConfig(): void {
		setTimeout(() => {
			this.ruleSetRepository.setModulesConfig(this.ruleSetId, this.ruleSetService.modulesConfig).subscribe();
		});
	}

	public removeDamageType(type: DamageTypeData): void {
		for (let i = 0; i < this.ruleSetService.damageTypes.length; i++) {
			if (type.name === this.ruleSetService.damageTypes[i].name) {
				this.ruleSetService.damageTypes.splice(i, 1);
				this.ruleSetRepository.setDamageTypes(this.ruleSetId, this.ruleSetService.damageTypes).subscribe();
				return;
			}
		}
	}

	public removeCondition(condition: ConditionData): void {
		for (let i = 0; i < this.ruleSetService.conditions.length; i++) {
			if (condition.name === this.ruleSetService.conditions[i].name) {
				this.ruleSetService.conditions.splice(i, 1);
				this.ruleSetRepository.setConditions(this.ruleSetId, this.ruleSetService.conditions).subscribe();
				return;
			}
		}
	}

	public editCondition(conditionIndex: number): void {
		let condition: ConditionData = JSON.parse(JSON.stringify(this.ruleSetService.conditions[conditionIndex]));
		this.dialog.open(NewConditionDialogComponent, {data: {condition: condition}}).afterClosed().pipe(first()).subscribe((condition: ConditionData) => {
			if (condition) {
				let unique = true;
				for (let i = 0; i < this.ruleSetService.conditions.length; i++) {
					let type = this.ruleSetService.conditions[i];
					if (i === conditionIndex) {
						continue;
					}
					if (type.name === condition.name) {
						unique = false;
						break;
					}
				}
				if (unique) {
					this.ruleSetService.conditions.splice(conditionIndex, 1, condition);
					this.ruleSetRepository.setConditions(this.ruleSetId, this.ruleSetService.conditions).subscribe();
				}
				else {
					this.alertService.showAlert('Condition with that name already exists')
				}
			}
		});
	}

	public filterNPCs(value: string): void {
		this.npcDataSource.filter = value.trim().toLowerCase();
	}

	public filterConditions(value: string): void {
		this.conditions = [];
		this.ruleSetService.conditions.forEach((condition: ConditionData) => {
			if (condition.name.trim().toLowerCase().includes(value.trim().toLowerCase())) {
				this.conditions.push(condition);
			}
		});
	}

	public filterDamageTypes(value: string): void {
		this.damageTypes = [];
		this.ruleSetService.damageTypes.forEach((damageType: DamageTypeData) => {
			if (damageType.name.trim().toLowerCase().includes(value.trim().toLowerCase())) {
				this.damageTypes.push(damageType);
			}
		});
	}

	private getNPCs(): void {
		this.ruleSetRepository.getNpcs(this.ruleSetId).pipe(map((npcs: NpcData[]) => {
			for (let npc of npcs) {
				for (let sheet of this.characterSheets) {
					if (npc.characterSheetId === sheet._id) {
						npc.characterSheetLabel = sheet.label;
						break;
					}
				}
			}

			return npcs;
		})).subscribe((npcs: NpcData[]) => {
			this.npcDataSource = new MatTableDataSource(npcs);
		});
	}

	private createNPC = () => {
		this.dialog.open(NewCharacterDialogComponent, {
			data: {
				characterSheets: this.characterSheets,
				isNpc: true
			}
		}).afterClosed().subscribe((npc) => {
			if (npc) {
				this.router.navigate(['character', npc._id]);
			}
		});
	};

	private openNewDamageTypeDialog = () => {
		this.dialog.open(NewDamageTypeDialogComponent).afterClosed().pipe(first()).subscribe((damageType: DamageTypeData) => {
			if (damageType) {
				let unique = true;
				for (let type of this.ruleSetService.damageTypes) {
					if (type.name === damageType.name) {
						unique = false;
						break;
					}
				}
				if (unique) {
					this.ruleSetService.damageTypes.push(damageType);
					this.ruleSetRepository.setDamageTypes(this.ruleSetId, this.ruleSetService.damageTypes).subscribe();
				}
			}
		});
	};

	private openNewConditionDialog = () => {
		this.dialog.open(NewConditionDialogComponent).afterClosed().pipe(first()).subscribe((condition: ConditionData) => {
			if (condition) {
				let unique = true;
				for (let type of this.ruleSetService.conditions) {
					if (type.name === condition.name) {
						unique = false;
						break;
					}
				}
				if (unique) {
					this.ruleSetService.conditions.push(condition);
					this.ruleSetRepository.setConditions(this.ruleSetId, this.ruleSetService.conditions).subscribe();
				}
			}
		});
	};

	private addAdmins = () => {
		const dialogRef = this.dialog.open(SelectFriendsComponent);
		dialogRef.afterClosed().pipe(first()).subscribe((friends: UserProfile[]) => {
			if (!isUndefined(friends)) {
				const adminUserIds = [];
				for (let friend of friends) {
					adminUserIds.push(friend._id);
				}

				this.ruleSetRepository.addAdmins(this.ruleSetId, adminUserIds).subscribe();
			}
		});
	}
}

interface AdminData {
	username: string,
	role: string
}

interface NpcData {
	_id: string,
	label: string,
	characterSheetId: string,
	characterSheetLabel?: string,
	ruleSetId: string,
	values: any[]
}
