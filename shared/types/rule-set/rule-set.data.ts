import { RuleSetConfigData } from './rule-set-config.data';

export interface RuleSetData {
	_id: string;
	label: string;
	characterSheets: any[];
	admins: any[];
	config: RuleSetConfigData;
}