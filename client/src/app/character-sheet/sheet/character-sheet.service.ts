import { Injectable } from '@angular/core';
import { CharacterInterfaceService } from '../shared/character-interface.service';
import { Aspect, AspectType } from '../shared/aspect';
import { SubComponent } from '../shared/subcomponents/sub-component';
import { AspectValue } from '../shared/aspectValue';
import { CharacterSheetData } from '../../../../../shared/types/rule-set/character-sheet.data';
import { Observable, of } from 'rxjs';
import { CharacterData } from '../../../../../shared/types/character.data';
import { AspectData } from '../../../../../shared/types/rule-set/aspect.data';

@Injectable()
export class CharacterSheetService implements CharacterInterfaceService {
	public aspects: Aspect[];
	public characterSheet: CharacterSheetData;
	public immutable = true;

	private subComponents: SubComponent[];
	private aspectValues: any[];
	private characterData: CharacterData;

	constructor() {
		this.init();
	}

	init(): void {
		this.aspects = [];
		this.aspectValues = [];
		this.subComponents = [];
	}

	registerSubComponent(subComponent: SubComponent): void {
		this.subComponents.push(subComponent);
		this.aspectValues.forEach((value: AspectValue) => {
			if (value.key === subComponent.aspect._id) {
				subComponent.child.setValue(value.value);
			}
		});
	}

	valueOfAspect(aspect: Aspect): any {
		for (let i = 0; i < this.subComponents.length; i++) {
			let subComponent = this.subComponents[i];
			if (subComponent.aspect.label === aspect.label) {
				return subComponent.getValue();
			}
		}

		return null;
	}

	updateFunctionAspects(): void {
		this.subComponents.forEach(subComponent => {
			if (subComponent.aspect.aspectType === AspectType.FUNCTION) {
				subComponent.getValue();
			}
		})
	}

	getValueOfAspectByLabel(label: string): any {
	}

	getGridHeight(): number {
		let aspects = document.getElementsByTagName('character-aspect');
		let height = 0;
		for (let i = 0; i < aspects.length; i++) {
			let aspect = aspects[i];
			let clientRect = aspect.getBoundingClientRect();
			let tempHeight = this.aspects[i].config.top + clientRect.height - 30;
			if (tempHeight > height) {
				height = tempHeight;
			}
		}

		return height;
	}

	public setCharacterData(data: CharacterData): void {
		this.characterData = data;
		this.characterSheet = this.characterData.characterSheet;
		this.aspectValues = this.characterData.values;
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
	}

	get removeComponentObservable(): Observable<void> {
		return of();
	}

	removeComponent(aspect: Aspect): void {

	}
}