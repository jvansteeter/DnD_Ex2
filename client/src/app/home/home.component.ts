import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewRuleSetDialogComponent } from './dialog/new-rule-set-dialog.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
    selector: 'home-page',
    templateUrl: 'home.component.html'
})
export class HomeComponent implements AfterViewInit {
    public ruleSets: any[];

    constructor(private dialog: MatDialog,
                private http: HttpClient,
                private router: Router) {

    }

    public ngAfterViewInit(): void {
        this.getRuleSets();
    }

    public newRuleSet(): void {
        this.dialog.open(NewRuleSetDialogComponent);
    }

    public ruleSetHome(ruleSetId: string): void {
        this.router.navigate(['/rule-set', ruleSetId]);
    }

    private getRuleSets(): void {
        this.http.get('/api/ruleset/userrulesets', {responseType: 'json'}).subscribe((ruleSets: any) => {
            this.ruleSets = ruleSets;
        });
    }
}
