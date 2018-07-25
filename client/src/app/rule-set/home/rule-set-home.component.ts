import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NewCharacterSheetDialogComponent } from './dialog/new-character-sheet-dialog.component';
import { Subject } from 'rxjs';
import { NewNpcDialogComponent } from './dialog/new-npc-dialog.component';
import { RuleSetRepository } from '../../repositories/rule-set.repository';
import { SubjectDataSource } from '../../utilities/subjectDataSource';
import { CharacterSheetData } from '../../../../../shared/types/character-sheet.data';
import { DashboardCard } from '../../cdk/dashboard-card/dashboard-card';

@Component({
	selector: 'rule-set-home',
	templateUrl: 'rule-set-home.component.html',
	styleUrls: ['rule-set-home.component.css']
})
export class RuleSetHomeComponent implements OnInit {
	private ruleSetId: string;
	private ruleSet: any;

	public characterSheets: CharacterSheetData[];
	public admins: any[];
	public npcs: any[];

	private readonly adminSubject: Subject<AdminData[]>;
	private adminDataSource: SubjectDataSource<AdminData>;
	public adminColumns = ['username', 'role'];

	public characterSheetCard: DashboardCard;
	private readonly characterSheetSubject: Subject<CharacterSheetData[]>;
	private characterSheetDataSource: SubjectDataSource<CharacterSheetData>;
	public characterSheetColumns = ['label'];

	private readonly npcSubject: Subject<NpcData[]>;
	private npcDataSource: SubjectDataSource<NpcData>;
	public npcColumns = ['label', 'edit'];

	constructor(private activatedRoute: ActivatedRoute,
	            private dialog: MatDialog,
	            private router: Router,
	            private ruleSetRepository: RuleSetRepository) {
		this.adminSubject = new Subject<AdminData[]>();
		this.adminDataSource = new SubjectDataSource(this.adminSubject);

		this.characterSheetCard = {
			menuOptions: [
				{
					title: 'New Character Sheet',
					function: this.newCharacterSheet
				}
			]
		};
		this.characterSheetSubject = new Subject<CharacterSheetData[]>();
		this.characterSheetDataSource = new SubjectDataSource<CharacterSheetData>(this.characterSheetSubject);

		this.npcSubject = new Subject<NpcData[]>();
		this.npcDataSource = new SubjectDataSource(this.npcSubject);
	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params) => {
			this.ruleSetId = params['ruleSetId'];
			this.ruleSetRepository.getRuleSet(this.ruleSetId).subscribe((ruleSet: any) => {
				this.ruleSet = ruleSet;
			});
			this.ruleSetRepository.getCharacterSheets(this.ruleSetId).subscribe((characterSheets: CharacterSheetData[]) => {
				this.characterSheets = characterSheets;
				this.characterSheetSubject.next(characterSheets);
			});
			this.ruleSetRepository.getAdmin(this.ruleSetId).subscribe((admins: any[]) => {
				this.admins = admins;
				this.adminSubject.next(admins);
			});
			this.ruleSetRepository.getNpcs(this.ruleSetId).subscribe((npcs: any[]) => {
				this.npcs = npcs;
				this.npcSubject.next(npcs);
			});
		});
	}

	private newCharacterSheet = () => {
		this.dialog.open(NewCharacterSheetDialogComponent, {data: {ruleSetId: this.ruleSetId}}).afterClosed().subscribe((characterSheet: CharacterSheetData) => {
			this.router.navigate(['character-sheet', characterSheet._id]);
		});
	};

	editCharacterSheet(characterSheetId: string): void {
		this.router.navigate(['character-sheet', characterSheetId]);
	}

	createNPC(): void {
		this.dialog.open(NewNpcDialogComponent, {data: {characterSheets: this.characterSheets}});
	}

	editNpc(npcId: string): void {
		this.router.navigate(['npc', npcId]);
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
	ruleSetId: string,
	values: any[]
}
