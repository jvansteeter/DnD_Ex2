import { Injectable } from '@angular/core';
import { isUndefined } from 'util';
import { RuleFunction } from '../subcomponents/function/rule-function';
import { RuleData } from '../../../../../../shared/types/rule.data';
import { Aspect, AspectType } from '../aspect';
import { AspectServiceInterface } from '../../../data-services/aspect.service.interface';

@Injectable()
export class RuleService {
	private aspectService: AspectServiceInterface;

	constructor() {

	}

	public evaluationRuleCondition(condition: string, playerId?: string): boolean {
		if (isUndefined(this.aspectService)) {
			console.error('character service has not been defined');
			return false;
		}
		if (isUndefined(condition) || condition === '') {
			return true;
		}
		const result = new RuleFunction('this=' + condition, this.aspectService, playerId).execute();
		if (result === 'NaN') {
			return false;
		}
		return result;
	}

	public getRuleModifiers(aspect: Aspect, rules: RuleData[], playerId?: string): Map<string, any> {
		switch (aspect.aspectType) {
			case AspectType.NUMBER:
				return this.getNumericModifiers(aspect.label, rules, playerId);
			default:
				return new Map<string, any>();
		}
	}

	public setAspectService(service: AspectServiceInterface): void {
		this.aspectService = service;
	}

	private getNumericModifiers(aspectLabel: string, rules: RuleData[], playerId?: string): Map<string, any> {
		const resultMap = new Map<string, any>();
		for (const rule of rules) {
			if (this.evaluationRuleCondition(rule.condition, playerId)) {
				let ruleTotal: number = 0;
				for (const effect of rule.effects) {
					if (effect.aspectLabel === aspectLabel) {
						effect.result = new RuleFunction(effect.modFunction, this.aspectService, playerId).execute();
						ruleTotal += Number(effect.result);
					}
				}
				if (ruleTotal !== 0) {
					resultMap.set(rule.name, ruleTotal);
				}
			}
		}

		return resultMap;
	}
}