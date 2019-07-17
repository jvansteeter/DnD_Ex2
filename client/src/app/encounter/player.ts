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

export class Player extends ConcurrentBoardObject implements PlayerData {
	_id: string;
	private _userId: string;
	private _name: string;
	private _hp: number;
	private _maxHp: number;
	private _ac: number;
	private _speed: number;
	private _location: XyPair;
	private _isVisible: boolean;
	private _tokens: TokenData[];
	private _activeTokenIndex: number = 0;
	private _token_imgs: HTMLImageElement[];
	private _actions: { action: string, detail: string }[];
	private _initiative: number;
	private _teams: string[] = [];
	private _auras: Map<string, AuraData> = new Map<string, AuraData>();

	public encounterId: string;
	public characterData: CharacterData;

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
			characterData: this.characterData,
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
		this._speed = playerData.characterData.values[RuleModuleAspects.SPEED];
		this.encounterId = playerData.encounterId;
		this.characterData = playerData.characterData;
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
		const conditions: ConditionData[] = this.characterData.values[RuleModuleAspects.CONDITIONS];
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

	get ac(): number {
		return this._ac;
	}

	set ac(value: number) {
		this._ac = value;
		this.emitChange();
	}

	get speed(): number {
		return this._speed;
	}

	set speed(value: number) {
		this._speed = value;
		this.emitChange();
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
		if (!isNullOrUndefined(this.characterData.values['Health'])) {
			if (this.characterData.values['Health'].current <= 0) {
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
		return this.characterData.characterSheet.abilities;
	}

	get abilities(): AbilityData[] {
		return this.characterData.abilities;
	}

	set abilities(abilities: AbilityData[]) {
		this.characterData.abilities = abilities;
	}

	get auras(): AuraData[] {
		const result: AuraData[] = [];
		for (let value of this._auras.values()) {
			result.push(value);
		}

		return result;
	}
}
