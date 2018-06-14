import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RuleSetRepository } from '../../repositories/rule-set.repository';
import { RuleSet } from '../../types/RuleSet';

@Component({
    selector: 'rule-set-selector',
    templateUrl: 'rule-set-selector.component.html',
    styleUrls: ['rule-set-selector.component.css']
})
export class RuleSetSelectorComponent implements OnInit {
    @Output() ruleSetSelected: EventEmitter<RuleSet> = new EventEmitter();
    ruleSets: RuleSet[];

    constructor(private ruleSetRepository: RuleSetRepository) {
        this.ruleSets = [];
    }

    public ngOnInit(): void {
        this.ruleSetRepository.getRuleSets().subscribe((ruleSets: RuleSet[])=> {
            this.ruleSets = ruleSets;
        });
    }

    public selectRuleSet(ruleSet: RuleSet): void {
        this.ruleSetSelected.emit(ruleSet);
    }
}
