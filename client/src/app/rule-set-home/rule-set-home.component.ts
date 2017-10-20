import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NewCharacterSheetDialogComponent } from './dialog/new-character-sheet-dialog.component';
import { RuleSetHomeRepository } from './rule-set-home.repository';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { NewNpcDialogComponent } from './dialog/new-npc-dialog.component';

@Component({
    selector: 'rule-set-home',
    templateUrl: 'rule-set-home.component.html',
    styleUrls: ['rule-set-home.component.css']
})
export class RuleSetHomeComponent implements OnInit {
    private ruleSetId: string;
    private ruleSet: any;

    public characterSheets: any[];
    public admins: any[];
    public npcs: any[];

    private adminDataSource: AdminDataSource;
    private adminSubject: Subject<AdminData[]>;
    public adminColumns = ['username', 'role'];

    private npcDataSource: NpcDataSource;
    private npcSubject: Subject<NpcData[]>;
    public npcColumns = ['label', 'edit'];

    constructor(private activatedRoute: ActivatedRoute,
                private dialog: MatDialog,
                private router: Router,
                private ruleSetHomeRepository: RuleSetHomeRepository) {
        this.adminSubject = new Subject<AdminData[]>();
        this.adminDataSource = new AdminDataSource(this.adminSubject);

        this.npcSubject = new Subject<NpcData[]>();
        this.npcDataSource = new NpcDataSource(this.npcSubject);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.ruleSetId = params['ruleSetId'];
            this.ruleSetHomeRepository.getRuleSet(this.ruleSetId).subscribe((ruleSet: any) => {
                this.ruleSet = ruleSet;
            });
            this.ruleSetHomeRepository.getCharacterSheets(this.ruleSetId).subscribe((characterSheets: any[]) => {
                this.characterSheets = characterSheets;
            });
            this.ruleSetHomeRepository.getAdmin(this.ruleSetId).subscribe((admins: any[]) => {
                this.admins = admins;
                this.adminSubject.next(admins);
            });
            this.ruleSetHomeRepository.getNpcs(this.ruleSetId).subscribe((npcs: any[]) => {
                console.log('get npcs has returned')
                console.log(npcs)
                this.npcs = npcs;
                this.npcSubject.next(npcs);
            });
        });
    }

    newCharacterSheet(): void {
        this.dialog.open(NewCharacterSheetDialogComponent, {data: {ruleSetId: this.ruleSetId}});
    }

    editCharacterSheet(characterSheetId: string): void {
        this.router.navigate(['character-sheet', characterSheetId]);
    }

    createNPC(): void {
        this.dialog.open(NewNpcDialogComponent, {data: {characterSheets: this.characterSheets}});
    }

    editNpc(npcId: string): void {
        console.log('edit npc')
        console.log(npcId)
        this.router.navigate(['npc', npcId]);
    }
}

interface AdminData {
    username: string,
    role: string
}

class AdminDataSource extends DataSource<AdminData> {
    constructor(private adminSubject: Subject<AdminData[]>){
        super();
    }

    connect(): Observable<AdminData[]> {
        return this.adminSubject.asObservable();
    }

    disconnect(): void {
    }
}

interface NpcData {
    _id: string,
    label: string,
    characterSheetId: string,
    ruleSetId: string,
    values: any[]
}

class NpcDataSource extends DataSource<NpcData> {
    constructor(private npcSubject: Subject<NpcData[]>){
        super();
    }

    connect(): Observable<NpcData[]> {
        return this.npcSubject.asObservable();
    }

    disconnect(): void {
    }
}