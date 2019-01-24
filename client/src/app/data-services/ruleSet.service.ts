import { Injectable } from '@angular/core';
import { IsReadyService } from '../utilities/services/isReady.service';
import { RuleSetRepository } from '../repositories/rule-set.repository';
import { RuleSetData } from '../../../../shared/types/rule-set/rule-set.data';
import { isUndefined } from "util";

@Injectable()
export class RuleSetService extends IsReadyService {
	private ruleSetId: string;
	private ruleSet: RuleSetData;

	constructor(private ruleSetRepo: RuleSetRepository) {
		super();
	}

	public init(): void {
		this.ruleSetRepo.getRuleSet(this.ruleSetId).subscribe((ruleSet: RuleSetData) => {
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
			this.setReady(true);
		});
	}

	public setRuleSetId(ruleSetId: string): void {
		this.ruleSetId = ruleSetId;
		this.setReady(false);
		this.init();
	}

	get hasConditions(): boolean {
		return this.ruleSet.modulesConfig.conditions;
	}
}