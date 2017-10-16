import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { NewCharacterSheetDialogComponent } from './dialog/new-character-sheet-dialog.component';

@Component({
    selector: 'rule-set-home',
    templateUrl: 'rule-set-home.component.html',
    styleUrls: ['rule-set-home.component.css']
})
export class RuleSetHomeComponent implements OnInit {
    private ruleSetId: string;
    private ruleSet: any;

    public characterSheets: any[];

    constructor(private activatedRoute: ActivatedRoute,
                private http: HttpClient,
                private dialog: MatDialog,
                private router: Router) {

    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.ruleSetId = params['ruleSetId'];
            this.http.get('/api/ruleset/ruleset/' + this.ruleSetId, {responseType: 'json'}).subscribe((ruleSet: any) => {
                this.ruleSet = ruleSet;
                this.getCharacterSheets();
            });
        });
    }

    getCharacterSheets(): void {
        this.http.get('/api/ruleset/charactersheets/' + this.ruleSetId, {responseType: 'json'}).subscribe((characterSheets: any) => {
            console.log('character sheets')
            console.log(characterSheets)
            this.characterSheets = characterSheets;
        });
    }

    newCharacterSheet(): void {
        this.dialog.open(NewCharacterSheetDialogComponent, {data: {ruleSetId: this.ruleSetId}});
    }

    editCharacterSheet(characterSheetId: string): void {
        this.router.navigate(['character-sheet', characterSheetId]);
    }
}