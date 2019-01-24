import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharacterSheetData } from '../../../../shared/types/rule-set/character-sheet.data';
import { RuleSetData } from '../../../../shared/types/rule-set/rule-set.data';
import { RuleSetModulesConfigData } from '../../../../shared/types/rule-set/rule-set-modules-config.data';
import { DamageTypeData } from '../../../../shared/types/rule-set/damage-type.data';
import { ConditionData } from '../../../../shared/types/rule-set/condition.data';

@Injectable()
export class RuleSetRepository {
	constructor(private http: HttpClient) {

	}

	public getRuleSets(): Observable<RuleSetData[]> {
		return this.http.get<RuleSetData[]>('/api/ruleset/userrulesets', {responseType: 'json'});
	}

	public getRuleSet(ruleSetId: string): Observable<RuleSetData> {
		return this.http.get<RuleSetData>('/api/ruleset/ruleset/' + ruleSetId, {responseType: 'json'});
	}

	public getCharacterSheets(ruleSetId: string): Observable<CharacterSheetData[]> {
		return this.http.get<CharacterSheetData[]>('/api/ruleset/charactersheets/' + ruleSetId, {responseType: 'json'});
	}

	public getAdmin(ruleSetId: string): Observable<any> {
		return this.http.get('/api/ruleset/admins/' + ruleSetId, {responseType: 'json'});
	}

	public getNpcs(ruleSetId: string): Observable<any> {
		return this.http.get('/api/ruleset/npcs/' + ruleSetId, {responseType: 'json'});
	}

	public getExportJson(ruleSetId: string): Observable<Object> {
		return this.http.get<Object>('/api/ruleset/export/' + ruleSetId, {responseType: 'json'});
	}

	public importRuleSetFromJson(jsonFile: any): Observable<void> {
		return this.http.post<void>('/api/ruleset/import/', {file: jsonFile});
	}

	public deleteRuleSet(ruleSetId: string): Observable<void> {
		return this.http.post<void>('/api/ruleset/delete', {ruleSetId: ruleSetId});
	}

	public setModulesConfig(ruleSetId: string, modulesConfig: RuleSetModulesConfigData): Observable<void> {
		const data = {
			ruleSetId: ruleSetId,
			config: modulesConfig,
		};
		return this.http.post<void>('/api/ruleset/modulesConfig', data);
	}

	public setDamageTypes(ruleSetId: string, damageTypes: DamageTypeData[]): Observable<void> {
		const data = {
			ruleSetId: ruleSetId,
			damageTypes: damageTypes,
		};
		return this.http.post<void>('/api/ruleset/damageTypes', data);
	}

	public setConditions(ruleSetId: string, conditions: ConditionData[]): Observable<void> {
		const data = {
			ruleSetId: ruleSetId,
			conditions: conditions,
		};
		return this.http.post<void>('/api/ruleset/conditions', data);
	}

	public addAdmins(ruleSetId: string, adminUserIds: string[]): Observable<void> {
		const data = {
			ruleSetId: ruleSetId,
			adminUserIds: adminUserIds,
		};
		return this.http.post<void>('/api/ruleset/addAdmins', data);
	}
}