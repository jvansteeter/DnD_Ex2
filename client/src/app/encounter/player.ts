import { XyPair } from "../../../../shared/types/encounter/board/xy-pair";
import { isNullOrUndefined, isUndefined } from 'util';
import { PlayerData } from '../../../../shared/types/encounter/player.data';
import { CharacterData } from '../../../../shared/types/character.data';
import { ConcurrentBoardObject } from './concurrent-board-object';
import { PredefinedAspects, RuleModuleAspects } from '../../../../shared/predefined-aspects.enum';
import { ConditionData } from '../../../../shared/types/rule-set/condition.data';
import { isDefined } from '@angular/compiler/src/util';
import { TokenData } from '../../../../shared/types/token.data';
import { AbilityData } from '../../../../shared/types/ability.data';
import { AuraData } from '../../../../shared/types/aura.data';
import { AspectServiceInterface } from '../data-services/aspect.service.interface';
import { RuleService } from '../character-sheet/shared/rule/rule.service';
import { Aspect, AspectType } from '../character-sheet/shared/aspect';
import { RuleData } from '../../../../shared/types/rule.data';
import { CharacterSheetTooltipData } from '../../../../shared/types/rule-set/character-sheet-tooltip.data';
import { ResistanceData } from '../../../../shared/types/resistance.data';

export class Player extends ConcurrentBoardObject implements PlayerData {
	_id: string;
	private _userId: string;
	private _name: string;
	private _hp: number;
	private _maxHp: number;
	private _location: XyPair;
	private _isVisible: boolean;
	private _tokens: TokenData[];
	private _activeTokenIndex: number = 0;
	private _token_imgs: HTMLImageElement[];
	private _actions: { action: string, detail: string }[];
	private _initiative: number;
	private _teams: string[] = [];
	private _auras: Map<string, AuraData> = new Map<string, AuraData>();
	private privatePlayerService: PrivatePlayerService;
	private _characterData: CharacterData;

	public encounterId: string;

	constructor(playerData: PlayerData) {
		super();
		this._id = playerData._id;
		this.setPlayerData(playerData);

		this._actions = [];
	}

	public serialize(): PlayerData {
		return {
			_id: this._id,
			encounterId: this.encounterId,
			userId: this._userId,
			activeTokenIndex: this._activeTokenIndex,
			characterData: this._characterData,
			initiative: this._initiative,
			location: this._location,
			isVisible: this._isVisible,
			teams: this._teams,
		}
	}

	public setPlayerData(playerData: PlayerData): void {
		if (playerData._id !== this._id) {
			return;
		}

		if (isUndefined(playerData.characterData.values)) {
			playerData.characterData.values = {};
		}
		if (!isUndefined(playerData.characterData.values[PredefinedAspects.NAME])) {
			this._name = playerData.characterData.values[PredefinedAspects.NAME];
		}
		else {
			this._name = playerData.characterData.label;
		}
		if (!isUndefined(playerData.characterData.values[PredefinedAspects.HEALTH])) {
			this._maxHp = playerData.characterData.values[PredefinedAspects.HEALTH].max;
			this._hp = playerData.characterData.values[PredefinedAspects.HEALTH].current;
		}
		else {
			this._maxHp = 1;
			this._hp = 1;
		}
		this.encounterId = playerData.encounterId;
		this._characterData = playerData.characterData;
		this._initiative = playerData.initiative;
		if (!isUndefined(playerData.location) && !isUndefined(playerData.location.x) && !isUndefined(playerData.location.y)) {
			this._location = new XyPair(playerData.location.x, playerData.location.y);
		}
		else {
			this._location = new XyPair(0, 0);
		}
		if (isDefined(playerData.characterData.tokens) && playerData.characterData.tokens.length > 0) {
			this._tokens = playerData.characterData.tokens;
			this._token_imgs = [];
			for (let token of playerData.characterData.tokens) {
				const tokenImage = new Image();
				tokenImage.src = token.url;
				this._token_imgs.push(tokenImage)
			}
		}
		this._isVisible = playerData.isVisible;
		this._userId = playerData.userId;
		this._teams = playerData.teams;
		this._activeTokenIndex = playerData.activeTokenIndex;

		this.privatePlayerService = new PrivatePlayerService(this);
		this.privatePlayerService.updateRuleModifiers();
	}

	public isMemberOfTeam(team: string): boolean {
		for (let myTeam of this._teams) {
			if (myTeam === team) {
				return true;
			}
		}

		return false;
	}

	public toggleTeam(team: string): void {
		for (let i = 0; i < this._teams.length; i++) {
			if (team === this._teams[i]) {
				this._teams.splice(i, 1);
				this.emitChange();
				return;
			}
		}

		this._teams.push(team);
		this.emitChange();
	}

	public decrementConditionRounds(): void {
		const conditions: ConditionData[] = this._characterData.values[RuleModuleAspects.CONDITIONS];
		if (isDefined(conditions) && conditions.length > 0) {
			let conditionChanged = false;
			let conditionsToRemove = [];
			for (let i = 0; i < conditions.length; i++) {
				let condition = conditions[i];
				if (Number.isInteger(condition.rounds)) {
					condition.rounds--;
					if (condition.rounds <= 0) {
						conditionsToRemove.push(i)
					}
					conditionChanged = true;
				}
			}
			while (conditionsToRemove.length > 0) {
				const index = conditionsToRemove.pop();
				conditions.splice(index, 1);
			}
			if (conditionChanged) {
				this.emitChange();
			}
		}
	}

	public setTokenWidth(tokenIndex: number, width: number): void {
		this._tokens[tokenIndex].widthInCells = width;
		this.emitChange();
	}

	public setTokenHeight(tokenIndex: number, height: number): void {
		this._tokens[tokenIndex].heightInCells = height;
		this.emitChange();
	}

	public addAura(aura: AuraData): void {
		this._auras.set(aura.name, aura);
	}

	public removeAura(name: string): void {
		this._auras.delete(name);
	}

	public removeAuras(): void {
		this._auras.clear();
	}

	public getAspectValue(aspectLabel: string, withModifiers: boolean = true): any {
		let value: any;
		if (withModifiers && this.privatePlayerService.effectiveValues.has(aspectLabel)) {
			value = this.privatePlayerService.effectiveValues.get(aspectLabel);
		}
		else {
			value = this._characterData.values[aspectLabel];
		}

		if (isNullOrUndefined(value)) {
			for (const item in this._characterData.values) {
				if (aspectLabel.trim().toLowerCase() === item.trim().toLowerCase()) {
					value = this._characterData.values[item];
				}
			}
		}


		return value;
	}

	public setAspectValue(aspect: Aspect, value: any, aspectItem?: string): void {
		if (aspect.aspectType === AspectType.BOOLEAN) {
			value = value == 'true';
		}
		if (isDefined(aspectItem)) {
			this._characterData.values[aspect.label][aspectItem] = value;
		}
		else {
			this._characterData.values[aspect.label] = value;
		}
		this.privatePlayerService.updateRuleModifiers();
		this.emitChange();
	}

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		GETTERS & SETTERS
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
		this.emitChange();
	}

	get activeTokenIndex(): number {
		return this._activeTokenIndex;
	}

	set activeTokenIndex(index: number) {
		this._activeTokenIndex = index;
		this.emitChange();
	}

	get hp(): number {
		return this._hp;
	}

	set hp(value: number) {
		this._hp = value;
		this.emitChange();
	}

	get maxHp(): number {
		return this._maxHp;
	}

	set maxHp(value: number) {
		this._maxHp = value;
		this.emitChange();
	}

	get speed(): number {
		return Number(this.getAspectValue(RuleModuleAspects.SPEED));
	}

	get vision(): number {
		return Number(this.getAspectValue(RuleModuleAspects.VISION));
	}

	get perception(): number {
		return Number(this.getAspectValue(RuleModuleAspects.PERCEPTION));
	}

	get location(): XyPair {
		return this._location;
	}

	set location(value: XyPair) {
		this._location = value;
		this.emitChange();
	}

	get tokens(): TokenData[] {
		return this._tokens;
	}

	set tokens(tokens: TokenData[]) {
		this._tokens = tokens;
		this.emitChange();
	}

	get token_img(): HTMLImageElement {
		return this._token_imgs[this._activeTokenIndex];
	}

	set token_img(value: HTMLImageElement) {
		this._token_imgs[0] = value;
		this.emitChange();
	}

	get tokenUrl(): string {
		return this.tokens[this._activeTokenIndex].url;
	}

	get tokenWidth(): number {
		return this.tokens[this._activeTokenIndex].widthInCells;
	}

	get tokenHeight(): number {
		return this.tokens[this._activeTokenIndex].heightInCells;
	}

	get actions(): { action: string; detail: string }[] {
		return this._actions;
	}

	set actions(value: { action: string; detail: string }[]) {
		this._actions = value;
		this.emitChange();
	}

	get isVisible(): boolean {
		return this._isVisible;
	}

	get isDead(): boolean {
		const effectiveHealthObject: {current: number, max: number} = this.getAspectValue(PredefinedAspects.HEALTH);
		if (!isNullOrUndefined(effectiveHealthObject)) {
			if (effectiveHealthObject.current <= 0) {
				return true;
			}
		}
		return false;
	}

	set isVisible(value) {
		this._isVisible = value;
		this.emitChange();
	}

	get userId(): string {
		return this._userId;
	}

	set userId(value) {
		this._userId = value;
		this.emitChange();
	}

	get initiative(): number {
		return this._initiative;
	}

	set initiative(value: number) {
		this._initiative = value;
		this.emitChange();
	}

	get teams(): string[] {
		return this._teams;
	}

	set teams(value: string[]) {
		this._teams = value;
		this.emitChange();
	}

	get defaultAbilities(): AbilityData[] {
		return this._characterData.characterSheet.abilities;
	}

	get abilities(): AbilityData[] {
		return this._characterData.abilities;
	}

	set abilities(abilities: AbilityData[]) {
		this._characterData.abilities = abilities;
	}

	get auras(): AuraData[] {
		const result: AuraData[] = [];
		for (let value of this._auras.values()) {
			result.push(value);
		}

		return result;
	}

	get rules(): RuleData[] {
		return this._characterData.characterSheet.rules;
	}

	get aspects(): {icon: string, aspect: Aspect}[] {
		return this._characterData.characterSheet.tooltipConfig.aspects;
	}

	set characterData(value) {
		// never call this, only here for interface reasons
	}

	get tooltipConfig(): CharacterSheetTooltipData {
		return this._characterData.characterSheet.tooltipConfig
	}

	get modifiers(): Map<string, any> {
		return this.privatePlayerService.modifiers;
	}

	get conditions(): ConditionData[] {
		return this.getAspectValue(RuleModuleAspects.CONDITIONS);
	}

	get resistances(): ResistanceData[] {
		return this.getAspectValue((RuleModuleAspects.RESISTANCES));
	}

	set resistances(resistances: ResistanceData[]) {
		this._characterData.values[RuleModuleAspects.RESISTANCES] = resistances;
		this.privatePlayerService.updateRuleModifiers();
		this.emitChange();
	}

	get isHidden(): boolean {
		return this.getAspectValue(RuleModuleAspects.HIDDEN);
	}

	get stealth(): number {
		return Number(this.getAspectValue(RuleModuleAspects.STEALTH));
	}
}

class PrivatePlayerService implements AspectServiceInterface {
	private ruleService: RuleService;
	public modifiers: Map<string, any>;
	public effectiveValues: Map<string, any>;

	constructor(private player: Player) {
		this.ruleService = new RuleService();
		this.ruleService.setAspectService(this);
	}

	public getAspectValue(aspectLabel: string, playerId?: string): void {
		return this.player.getAspectValue(aspectLabel);
	}

	public updateRuleModifiers(): void {
		this.modifiers = new Map<string, any>();
		this.effectiveValues = new Map<string, any>();
		for (let aspect of this.player.aspects) {
			if (aspect.aspect.aspectType === AspectType.NUMBER) {
				let ruleModifiers = this.ruleService.getRuleModifiers(aspect.aspect, this.player.rules, this.player.id);
				let total = 0;
				for (let mod of ruleModifiers.values()) {
					total += Number(mod);
				}
				if (total !== 0) {
					this.modifiers.set(aspect.aspect.label, total);
					const aspectValue: number = this.player.getAspectValue(aspect.aspect.label, false);
					const effectiveValue: number = Number(aspectValue) + Number(total);
					this.effectiveValues.set(aspect.aspect.label, effectiveValue);
				}
			}
			if (aspect.aspect.aspectType === AspectType.CURRENT_MAX) {
				let ruleModifiers = this.ruleService.getRuleModifiers(aspect.aspect, this.player.rules, this.player.id);
				let currentTotal: number = 0;
				let maxTotal: number = 0;
				for (const mod of ruleModifiers.values()) {
					currentTotal += Number(mod.current);
					maxTotal += Number(mod.max);
				}
				if (currentTotal !== 0 || maxTotal !== 0) {
					this.modifiers.set(aspect.aspect.label, {current: currentTotal, max: maxTotal});
					const aspectValue: {current: number, max: number} = this.player.getAspectValue(aspect.aspect.label, false);
					const effectiveCurrent: number = Number(aspectValue.current) + Number(currentTotal);
					const effectiveMax: number = Number(aspectValue.max) + Number(currentTotal);
					this.effectiveValues.set(aspect.aspect.label, {current: effectiveCurrent, max: effectiveMax});
				}
			}
		}
	}
}
