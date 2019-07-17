import { Injectable } from '@angular/core';
import { RuleSetService } from './ruleSet.service';
import { CampaignService } from './campaign.service';
import { ConditionData } from '../../../../shared/types/rule-set/condition.data';
import { isUndefined } from 'util';

enum RulesMode {
	RULE_SET = 'RULE_SET',
	CAMPAIGN = 'CAMPAIGN',
}

@Injectable()
export class RulesConfigService {
	private ruleMode: RulesMode;
	private ruleSetService: RuleSetService;
	private campaignService: CampaignService;

	public setRuleSetService(ruleSetService: RuleSetService): void {
		this.ruleSetService = ruleSetService;
	}

	public setCampaignService(campaignService: CampaignService): void {
		this.campaignService = campaignService;
	}

	public setRuleSetRuleMode(): void {
		console.log('RulesConfig set to', RulesMode.RULE_SET)
		this.ruleMode = RulesMode.RULE_SET;
	}

	public setCampaignRuleMode(): void {
		this.ruleMode = RulesMode.CAMPAIGN;
	}

	get hasLightAndVision(): boolean {
		if (this.ruleMode === RulesMode.RULE_SET) {
			return this.ruleSetService.modulesConfig.lightAndVision;
		}
	}

	get hasConditions(): boolean {
		if (this.ruleMode === RulesMode.RULE_SET) {
			return this.ruleSetService.modulesConfig.conditions;
		}
	}

	get conditions(): ConditionData[] {
		if (this.ruleMode === RulesMode.RULE_SET) {
			if (isUndefined(this.ruleSetService.conditions)) {
				return [];
			}
			return this.ruleSetService.conditions;
		}
	}

	get hasRounds(): boolean {
		if (this.ruleMode === RulesMode.RULE_SET) {
			return this.ruleSetService.modulesConfig.rounds;
		}

		return false;
	}

	get hasHiddenAndSneaking(): boolean {
		if (this.ruleMode === RulesMode.RULE_SET) {
			return this.ruleSetService.modulesConfig.hiddenAndSneaking;
		}

		return false;
	}

	get hasCharacterAbilities(): boolean {
		if (this.ruleMode === RulesMode.RULE_SET) {
			return this.ruleSetService.modulesConfig.characterAbilities;
		}
	}
}