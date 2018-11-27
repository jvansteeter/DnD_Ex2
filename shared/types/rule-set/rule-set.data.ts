import { RuleSetConfigData } from './rule-set-config.data';

export interface RuleSetData {
	_id: string;
	label: string;
	admins: any[];
	config: RuleSetConfigData;
}