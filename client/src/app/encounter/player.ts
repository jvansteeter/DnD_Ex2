import { XyPair } from "../board/geometry/xy-pair";
import { isUndefined } from 'util';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerData } from '../../../../shared/types/encounter/player.data';
import { CharacterData } from '../../../../shared/types/character.data';
import { PredefinedAspects, RequiredAspects } from '../../../../shared/required-aspects.enum';

export class Player implements PlayerData {
	_id: string;
	private _name: string;
	private _hp: number;
	private _maxHp: number;
	private _ac: number;
	private _speed: number;
	private _location: XyPair;
	private _tokenUrl: string;
	private _token_img: HTMLImageElement;
	private _actions: { action: string, detail: string }[];

	encounterId: string;
	characterData: CharacterData;
	initiative: number;

	private changeEvent: EventEmitter<void> = new EventEmitter<void>(true);

	constructor(playerData: PlayerData) {
		this._id = playerData._id;
		this.setPlayerData(playerData);

		this._actions = [];
	}

	public serialize(): PlayerData {
		return {
			_id: this._id,
			encounterId: this.encounterId,
			characterData: this.characterData,
			initiative: this.initiative,
			location: this._location
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
		this._speed = playerData.characterData.values[RequiredAspects.SPEED];
		this.encounterId = playerData.encounterId;
		this.characterData = playerData.characterData;
		this.initiative = playerData.initiative;
		if (!isUndefined(playerData.location) && !isUndefined(playerData.location.x) && !isUndefined(playerData.location.y)) {
			this._location = new XyPair(playerData.location.x, playerData.location.y);
		}
		else {
			this._location = new XyPair(0, 0);
		}
		if (!!playerData.characterData.tokenUrl) {
			this._tokenUrl = playerData.characterData.tokenUrl;
			this._token_img = new Image();
			this._token_img.src = this._tokenUrl;
		}
	}

	addAction(action: string, detail: string) {
		this._actions.push({action, detail});
	}

	get changeObservable(): Observable<void> {
		return this.changeEvent.asObservable();
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
		this.changeEvent.emit();
	}

	get hp(): number {
		return this._hp;
	}

	set hp(value: number) {
		this._hp = value;
		this.changeEvent.emit();
	}

	get maxHp(): number {
		return this._maxHp;
	}

	set maxHp(value: number) {
		this._maxHp = value;
		this.changeEvent.emit();
	}

	get ac(): number {
		return this._ac;
	}

	set ac(value: number) {
		this._ac = value;
		this.changeEvent.emit();
	}

	get speed(): number {
		return this._speed;
	}

	set speed(value: number) {
		this._speed = value;
		this.changeEvent.emit();
	}

	get location(): XyPair {
		return this._location;
	}

	set location(value: XyPair) {
		this._location = value;
		this.changeEvent.emit();
	}

	get tokenUrl(): string {
		return this._tokenUrl;
	}

	set tokenUrl(value: string) {
		this._tokenUrl = value;
		this.changeEvent.emit();
	}

	get token_img(): HTMLImageElement {
		return this._token_img;
	}

	set token_img(value: HTMLImageElement) {
		this._token_img = value;
		this.changeEvent.emit();
	}

	get actions(): { action: string; detail: string }[] {
		return this._actions;
	}

	set actions(value: { action: string; detail: string }[]) {
		this._actions = value;
		this.changeEvent.emit();
	}
}
