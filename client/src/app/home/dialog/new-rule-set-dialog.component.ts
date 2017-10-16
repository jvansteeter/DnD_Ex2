import { AfterViewInit, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'new-rule-set',
    templateUrl: 'new-rule-set-dialog.component.html',
    styleUrls: ['new-rule-set-dialog.component.css']
})
export class NewRuleSetDialogComponent {
    public ruleSetLabel: string;

    constructor(private dialogRef: MatDialogRef<NewRuleSetDialogComponent>,
                private http: HttpClient) {
    }

    createNewRuleSet(): void {
        this.http.post('/api/ruleset/new/ruleset', {label: this.ruleSetLabel}, {responseType: 'text'}).subscribe(() => {
            this.dialogRef.close();
        });
    }
}
