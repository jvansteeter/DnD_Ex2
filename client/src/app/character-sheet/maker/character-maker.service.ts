import { Injectable } from '@angular/core';
import { Aspect, AspectType } from '../../types/character-sheet/aspect';
import { SubComponent } from '../shared/subcomponents/sub-component';
import { CategoryComponent, CategoryOption } from '../shared/subcomponents/category/category.component';
import { CheckboxListComponent } from '../shared/subcomponents/checkbox-list/checkbox-list.component';
import { FunctionComponent } from '../shared/subcomponents/function/function.component';
import { SubComponentChild } from '../shared/subcomponents/sub-component-child';
import { CharacterInterfaceService } from '../shared/character-interface.service';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { isUndefined } from 'util';

@Injectable()
export class CharacterMakerService implements CharacterInterfaceService {
	private characterSheetId: string;
	public aspects: Aspect[];
	public subComponents: Map<string, SubComponent>;

	immutable = false;

	constructor(private characterSheetRepository: CharacterSheetRepository) {
		this.init();
	}

	public init(): void {
		this.aspects = [];
		this.subComponents = new Map<string, SubComponent>();
	}

	public addComponent(aspect: any): void {
		this.aspects.push(aspect);
	}

	public removeComponent(aspect: any): void {
		let index = this.aspects.indexOf(aspect);
		this.aspects.splice(index, 1);
	}

	public registerSubComponent(subComponent: SubComponent): void {
		this.subComponents.set(subComponent.aspect._id, subComponent);
	}

	public getSubcomponent(aspect: Aspect): SubComponent {
		return this.subComponents.get(aspect._id);
	}

	public getAspectsOfType(type?: AspectType): Aspect[] {
		if (!type) {
			return this.aspects;
		}
		let result: Aspect[] = [];
		for (let i = 0; i < this.aspects.length; i++) {
			if (this.aspects[i].aspectType === type) {
				result.push(this.aspects[i]);
			}
		}

		return result;
	}

	public valueOfAspect(aspect: Aspect): any {
		return this.subComponents.get(aspect._id) ? this.subComponents.get(aspect._id).getValue() : undefined;
	}

	public updateFunctionAspects(): void {
		this.subComponents.forEach(subComponent => {
		    if (subComponent.aspect.aspectType === AspectType.FUNCTION) {
		        subComponent.getValue();
		    }
		});
	}

	public getCategoryOptions(aspect: Aspect): CategoryOption[] {
		if (aspect.aspectType !== AspectType.CATEGORICAL || isUndefined(this.subComponents.get(aspect._id))) {
			return undefined;
		}
		return (<CategoryComponent>this.subComponents.get(aspect._id).child).getCategories();
	}

	public save() {
		let characterSheet = {
			_id: this.characterSheetId,
		};
		let aspects: any[] = [];
		for (let i = 0; i < this.aspects.length; i++) {
			let aspect = this.aspects[i];
			let aspectObj = {
				_id: aspect._id,
				label: aspect.label,
				aspectType: aspect.aspectType,
				required: aspect.required,
				fontSize: aspect.fontSize,
				config: aspect.config
			};
			if (aspect.aspectType === AspectType.CATEGORICAL) {
				aspectObj['items'] = (<CategoryComponent>this.getChildOf(aspect)).getCategories();
			}
			else if (aspect.aspectType === AspectType.BOOLEAN_LIST) {
				aspectObj['items'] = (<CheckboxListComponent>this.getChildOf(aspect)).getCheckboxLabels();
			}
			else if (aspect.aspectType === AspectType.FUNCTION) {
				aspectObj['functionGrammar'] = (<FunctionComponent>this.getChildOf(aspect)).getFunction();
			}
			aspects.push(aspectObj);
		}
		characterSheet['aspects'] = aspects;
		this.characterSheetRepository.saveCharacterSheet(characterSheet).subscribe();
	}

	private getChildOf(aspect: Aspect): SubComponentChild | undefined {
		return this.subComponents.get(aspect._id) ? this.subComponents.get(aspect._id).child : undefined;
	}

	public setCharacterSheetId(id: string): void {
		this.characterSheetId = id;
	}

	public initAspects(aspects: any[]): void {
		this.aspects = [];
		aspects.forEach(aspectObj => {
			let aspect = new Aspect(aspectObj.label, aspectObj.aspectType, aspectObj.required);
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