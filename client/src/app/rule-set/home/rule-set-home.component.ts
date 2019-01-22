import * as FileSaver from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NewCharacterSheetDialogComponent } from './dialog/new-character-sheet-dialog.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { RuleSetRepository } from '../../repositories/rule-set.repository';
import { SubjectDataSource } from '../../utilities/subjectDataSource';
import { CharacterSheetData } from '../../../../../shared/types/rule-set/character-sheet.data';
import { DashboardCard } from '../../cdk/dashboard-card/dashboard-card';
import { RuleSetData } from '../../../../../shared/types/rule-set/rule-set.data';
import { ConfigService } from '../../data-services/config.service';
import { NewCharacterDialogComponent } from './dialog/new-character-dialog.component';
import { CharacterRepository } from '../../repositories/character.repository';
import { CharacterData } from '../../../../../shared/types/character.data';
import { isUndefined } from 'util';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { first, map, tap } from 'rxjs/operators';
import { NewDamageTypeDialogComponent } from './dialog/new-damage-type-dialog.component';
import { DamageTypeData } from '../../../../../shared/types/rule-set/damage-type.data';
import { SelectFriendsComponent } from '../../social/select-friends/select-friends.component';
import { UserProfile } from '../../types/userProfile';

@Component({
	selector: 'rule-set-home',
	templateUrl: 'rule-set-home.component.html',
	styleUrls: ['rule-set-home.component.scss']
})
export class RuleSetHomeComponent implements OnInit {
	private ruleSetId: string;
	private ruleSet: RuleSetData;

	public characterSheets: CharacterSheetData[];
	public admins: any[];
	public npcs: any[];

	public configCard: DashboardCard;

	public adminsCard: DashboardCard;
	private readonly adminSubject: Subject<AdminData[]>;
	private adminDataSource: SubjectDataSource<AdminData>;
	public adminColumns = ['username', 'role'];

	public characterSheetCard: DashboardCard;
	private readonly characterSheetSubject: BehaviorSubject<CharacterSheetData[]>;
	private characterSheetDataSource: SubjectDataSource<CharacterSheetData>;
	public characterSheetColumns = ['label', 'options'];

	public npcCard: DashboardCard;
	private readonly npcSubject: Subject<NpcData[]>;
	private npcDataSource: SubjectDataSource<NpcData>;
	public npcColumns = ['label', 'sheet', 'options'];

	public damageTypesCard: DashboardCard;

	constructor(private activatedRoute: ActivatedRoute,
	            private dialog: MatDialog,
	            private router: Router,
	            private ruleSetRepository: RuleSetRepository,
	            private characterRepo: CharacterRepository,
	            private configService: ConfigService,
	            private characterSheetRepo: CharacterSheetRepository) {
		this.adminSubject = new Subject<AdminData[]>();
		this.adminDataSource = new SubjectDataSource(this.adminSubject);

		this.configCard = {
			title: 'Rule Set Config'
		};
		this.adminsCard = {
			menuOptions: [
				{
					title: 'Add Admin',
					function: this.addAdmins
				}
			]
		};
		this.characterSheetCard = {
			menuOptions: [
				{
					title: 'New Character Sheet',
					function: this.newCharacterSheet
				}
			]
		};
		this.npcCard = {
			menuOptions: [
				{
					title: 'Create NPC',
					function: this.createNPC
				}
			]
		};
		this.damageTypesCard = {
			title: 'Damage Types',
			menuOptions: [
				{
					title: 'New Damage Type',
					function: this.openNewDamageTypeDialog
				}
			]
		};

		this.characterSheetSubject = new BehaviorSubject<CharacterSheetData[]>([]);
		this.characterSheetDataSource = new SubjectDataSource<CharacterSheetData>(this.characterSheetSubject);

		this.npcSubject = new Subject<NpcData[]>();
		this.npcDataSource = new SubjectDataSource(this.npcSubject);
	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params) => {
			this.ruleSetId = params['ruleSetId'];
			this.ruleSetRepository.getRuleSet(this.ruleSetId).subscribe((ruleSet: RuleSetData) => {
				if (isUndefined(ruleSet.modulesConfig)) {
					ruleSet.modulesConfig = {
						lightAndVision: true,
						damageTypes: false,
						damageMustBeTyped: false,
						equipment: false,
						characterAbilities: false,
						conditions: false,
					}
				}
				if (isUndefined(ruleSet.damageTypes)) {
					ruleSet.damageTypes = [];
				}
				this.ruleSet = ruleSet;
			});
			this.ruleSetRepository.getCharacterSheets(this.ruleSetId).pipe(
					tap((characterSheets: CharacterSheetData[]) => {
						this.characterSheets = characterSheets;
						this.characterSheetSubject.next(characterSheets);
					})
			).subscribe(() => {
				this.getNPCs();
			});
			this.ruleSetRepository.getAdmin(this.ruleSetId).subscribe((admins: any[]) => {
				this.admins = admins;
				this.adminSubject.next(admins);
			});
		});
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
			this.ruleSetRepository.setModulesConfig(this.ruleSetId, this.ruleSet.modulesConfig).subscribe();
		});
	}

	public removeDamageType(type: DamageTypeData): void {
		for (let i = 0; i < this.ruleSet.damageTypes.length; i++) {
			if (type.name === this.ruleSet.damageTypes[i].name) {
				this.ruleSet.damageTypes.splice(i, 1);
				this.ruleSetRepository.setDamageTypes(this.ruleSetId, this.ruleSet.damageTypes).subscribe();
				return;
			}
		}
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
			this.npcs = npcs;
			this.npcSubject.next(npcs);
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
				for (let type of this.ruleSet.damageTypes) {
					if (type.name === damageType.name) {
						unique = false;
						break;
					}
				}
				if (unique) {
					this.ruleSet.damageTypes.push(damageType);
					this.ruleSetRepository.setDamageTypes(this.ruleSetId, this.ruleSet.damageTypes).subscribe();
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
