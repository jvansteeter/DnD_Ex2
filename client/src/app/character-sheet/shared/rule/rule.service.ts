import { Injectable } from '@angular/core';
import { CharacterInterfaceService } from '../character-interface.service';
import { isUndefined } from 'util';
import { RuleFunction } from '../subcomponents/function/rule-function';
import { RuleData } from '../../../../../../shared/types/rule.data';
import { Aspect, AspectType } from '../aspect';

@Injectable()
export class RuleService {
	private characterService: CharacterInterfaceService;

	constructor() {

	}

	public evaluationRuleCondition(condition: string): boolean {
		if (isUndefined(this.characterService)) {
			console.error('character service has not been defined');
			return false;
		}

		const result = new RuleFunction(condition, this.characterService).execute();
		if (result === 'NaN') {
			return false;
		}

		return result;
	}

	public getRuleModifiers(aspect: Aspect, rules: RuleData[]): Map<string, any> {
		switch (aspect.aspectType) {
			case AspectType.NUMBER:
				return this.getNumericModifiers(aspect.label, rules);
			default:
				console.error('modifier type not implemented');
				return new Map<string, any>();
		}
	}

	public setCharacterService(service: CharacterInterfaceService): void {
		this.characterService = service;
	}

	private getNumericModifiers(aspectLabel: string, rules: RuleData[]): Map<string, any> {
		return new Map<string, any>();
	}
}