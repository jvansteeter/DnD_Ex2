import { Injectable } from '@angular/core';
import { IsReadyService } from '../utilities/services/isReady.service';
import { RuleSetRepository } from '../repositories/rule-set.repository';
import { RuleSetData } from '../../../../shared/types/rule-set/rule-set.data';
import { isUndefined } from "util";
import { ConditionData } from '../../../../shared/types/rule-set/condition.data';
import { RuleSetModulesConfigData } from '../../../../shared/types/rule-set/rule-set-modules-config.data';
import { DamageTypeData } from '../../../../shared/types/rule-set/damage-type.data';

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
					conditions: false,
					rounds: false,
					damageTypes: false,
					damageMustBeTyped: false,
					equipment: false,
					characterAbilities: false,
				} as RuleSetModulesConfigData;
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

	get label(): string {
		return this.ruleSet.label;
	}

	get modulesConfig(): RuleSetModulesConfigData {
		return this.ruleSet.modulesConfig;
	}

	get conditions(): ConditionData[] {
		return this.ruleSet.conditions;
	}

	get damageTypes(): DamageTypeData[] {
		return this.ruleSet.damageTypes;
	}
}