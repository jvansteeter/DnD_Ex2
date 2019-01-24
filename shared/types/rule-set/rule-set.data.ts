import { RuleSetModulesConfigData } from './rule-set-modules-config.data';
import { DamageTypeData } from './damage-type.data';
import { ConditionData } from './condition.data';

export interface RuleSetData {
	_id: string;
	label: string;
	admins: any[];
	modulesConfig: RuleSetModulesConfigData;
	damageTypes?: DamageTypeData[];
	conditions?: ConditionData[];
}