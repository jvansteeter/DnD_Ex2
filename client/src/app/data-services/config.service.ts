import { Injectable } from '@angular/core';
import { RuleSetConfigData } from '../../../../shared/types/rule-set/rule-set-config.data';
import { isUndefined } from 'util';

@Injectable()
export class ConfigService {
	private config: RuleSetConfigData = {
		damageTypes: false,
		equipment: false,
		characterAbilities: false
	};

	public completeConfig(config: RuleSetConfigData): RuleSetConfigData {
		if (isUndefined(config)) {
			return this.config;
		}
		for (let item in this.config) {
			if (isUndefined(config[item])) {
				config[item] = false;
			}
		}

		return config;
	}
}
