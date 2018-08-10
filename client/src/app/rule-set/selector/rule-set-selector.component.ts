import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RuleSetRepository } from '../../repositories/rule-set.repository';
import { RuleSetData } from '../../../../../shared/types/rule-set/rule-set.data';

@Component({
    selector: 'rule-set-selector',
    templateUrl: 'rule-set-selector.component.html',
    styleUrls: ['rule-set-selector.component.css']
})
export class RuleSetSelectorComponent implements OnInit {
    @Output() ruleSetSelected: EventEmitter<RuleSetData> = new EventEmitter();
    ruleSets: RuleSetData[];

    constructor(private ruleSetRepository: RuleSetRepository) {
        this.ruleSets = [];
    }

    public ngOnInit(): void {
        this.ruleSetRepository.getRuleSets().subscribe((ruleSets: RuleSetData[])=> {
            this.ruleSets = ruleSets;
        });
    }

    public selectRuleSet(ruleSet: RuleSetData): void {
        this.ruleSetSelected.emit(ruleSet);
    }
}
