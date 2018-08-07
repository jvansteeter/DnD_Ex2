import { Injectable } from '@angular/core';
import { CharacterInterfaceService } from '../shared/character-interface.service';
import { Aspect, AspectType } from '../../types/character-sheet/aspect';
import { SubComponent } from '../shared/subcomponents/sub-component';
import { Npc } from '../../types/character-sheet/npc';
import { AspectValue } from '../../types/character-sheet/aspectValue';


@Injectable()
export class CharacterSheetService implements CharacterInterfaceService {
	public aspects: Aspect[];
	private subComponents: SubComponent[];
	private aspectValues: any[];

	public immutable = true;

	constructor() {
		this.init();
	}

	init(): void {
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

	populateCharacterData(characterData: Npc): void {
		this.aspectValues = characterData.values;
		this.aspects = characterData.characterSheet.aspects;
	}

	getValueOfAspectByLabel(label: string): any {
	}

	getGridHeight(): number {
		return 0;
	}
}