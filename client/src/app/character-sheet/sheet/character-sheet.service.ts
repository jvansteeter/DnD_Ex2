import { Injectable, ViewChild } from '@angular/core';
import { CharacterInterfaceService } from '../shared/character-interface.service';
import { Aspect, AspectType } from '../shared/aspect';
import { SubComponent } from '../shared/subcomponents/sub-component';
import { CharacterSheetData } from '../../../../../shared/types/rule-set/character-sheet.data';
import { Observable, of } from 'rxjs';
import { CharacterData } from '../../../../../shared/types/character.data';
import { AspectData } from '../../../../../shared/types/rule-set/aspect.data';
import { isUndefined } from 'util';
import { CharacterRepository } from '../../repositories/character.repository';
import { TokenComponent } from '../shared/subcomponents/token/token.component';

@Injectable()
export class CharacterSheetService implements CharacterInterfaceService {
	public aspects: Aspect[];
	public characterSheet: CharacterSheetData;
	public readonly immutable = true;

	private characterData: CharacterData;
	private subComponents: Map<string, SubComponent>;

	constructor(private characterRepo: CharacterRepository) {
		this.init();
	}

	init(): void {
		this.aspects = [];
		this.subComponents = new Map<string, SubComponent>();
	}

	registerSubComponent(subComponent: SubComponent): void {
		this.subComponents.set(subComponent.aspect.label.toLowerCase(), subComponent);
		subComponent.child.setValue(this.characterData.values[subComponent.aspect.label]);
	}

	valueOfAspect(aspectLabel: string): any {
		return this.subComponents.get(aspectLabel.toLowerCase()) ? this.subComponents.get(aspectLabel.toLowerCase()).getValue() : undefined;
	}

	updateFunctionAspects(): void {
		this.subComponents.forEach(subComponent => {
			if (subComponent.aspect.aspectType === AspectType.FUNCTION) {
				subComponent.getValue();
			}
		})
	}

	getGridHeight(): number {
		let aspects = document.getElementsByTagName('character-aspect');
		let height = 0;
		for (let i = 0; i < aspects.length; i++) {
			let aspect = aspects[i];
			let clientRect = aspect.getBoundingClientRect();
			let tempHeight = this.aspects[i].config.top + clientRect.height;
			if (tempHeight > height) {
				height = tempHeight;
			}
		}

		return height;
	}

	public setCharacterData(data: CharacterData): void {
		this.characterData = data;
		this.characterSheet = this.characterData.characterSheet;
		if (this.characterData.characterSheet.aspects) {
			this.characterData.characterSheet.aspects.forEach((aspectObj: AspectData) => {
				let aspect = new Aspect(aspectObj.label, aspectObj.aspectType, aspectObj.required, aspectObj.isPredefined);
				aspect._id = aspectObj._id;
				aspect.fontSize = aspectObj.fontSize;
				aspect.isNew = false;
				if (!!aspectObj.config) {
					aspect.config = aspectObj.config;
				}
				if (aspectObj.hasOwnProperty('items')) {
					aspect.items = aspectObj.items;
				}
				if (!!aspectObj.ruleFunction) {
					aspect.ruleFunction = aspectObj.ruleFunction;
				}

				this.aspects.push(aspect);
			});
		}
		if (isUndefined(this.characterData.values)) {
			this.characterData.values = {};
		}
	}

	get removeComponentObservable(): Observable<void> {
		return of();
	}

	removeComponent(aspect: Aspect): void {

	}

	public setTokenUrl(url: string): void {
		this.characterData.tokenUrl = url;
	}

	public save(): void {
		this.characterData.values = {};
		for (let aspect of this.aspects) {
			this.characterData.values[aspect.label] = this.valueOfAspect(aspect.label);
		}

		this.characterRepo.saveCharacter(this.characterData).subscribe();
	}
}
