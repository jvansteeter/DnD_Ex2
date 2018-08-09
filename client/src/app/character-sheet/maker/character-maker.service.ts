import { Injectable } from '@angular/core';
import { Aspect, AspectType } from '../../types/character-sheet/aspect';
import { SubComponent } from '../shared/subcomponents/sub-component';
import { CategoryComponent } from '../shared/subcomponents/category/category.component';
import { CheckboxListComponent } from '../shared/subcomponents/checkbox-list/checkbox-list.component';
import { FunctionComponent } from '../shared/subcomponents/function/function.component';
import { SubComponentChild } from '../shared/subcomponents/sub-component-child';
import { CharacterInterfaceService } from '../shared/character-interface.service';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { isUndefined } from 'util';
import { AspectData } from '../../../../../shared/types/aspect.data';
import { Observable, Subject } from 'rxjs';
import { AlertService } from '../../alert/alert.service';

@Injectable()
export class CharacterMakerService implements CharacterInterfaceService {
	private characterSheetId: string;
	public aspects: Aspect[];
	private subComponents: Map<string, SubComponent>;
	private removeComponentSubject = new Subject<void>();
	private registerSubComponentSubject = new Subject<SubComponent>();

	immutable = false;

	constructor(private characterSheetRepository: CharacterSheetRepository,
	            private alertService: AlertService) {
		this.init();
	}

	public init(): void {
		this.aspects = [];
		this.subComponents = new Map<string, SubComponent>();
	}

	public addComponent(aspect: Aspect): void {
		if (!isUndefined(this.subComponents.get(aspect.label.toLowerCase()))) {
			console.error('aspect with that name already exists');
			this.alertService.showAlert('Aspect with that name already exists');
			return;
		}
		this.aspects.push(aspect);
	}

	public removeComponent(aspect: Aspect): void {
		// let index = this.aspects.indexOf(aspect);
		let index: number = this.aspects.findIndex((nextAspect: Aspect) => {
			return aspect.equals(nextAspect);
		});
		this.aspects.splice(index, 1);
		this.subComponents.delete(aspect.label.toLowerCase());
		setTimeout(() => this.removeComponentSubject.next());
	}

	get removeComponentObservable(): Observable<void> {
		return this.removeComponentSubject.asObservable();
	}

	public registerSubComponent(subComponent: SubComponent): void {
		this.subComponents.set(subComponent.aspect.label.toLowerCase(), subComponent);
		this.registerSubComponentSubject.next(subComponent);
	}

	get registerSubComponentObservable(): Observable<SubComponent> {
		return this.registerSubComponentSubject.asObservable();
	}

	public valueOfAspect(aspect: Aspect): any {
		return this.subComponents.get(aspect.label.toLowerCase()) ? this.subComponents.get(aspect.label.toLowerCase()).getValue() : undefined;
	}

	public getValueOfAspectByLabel(label: string): any {
		return this.subComponents.get(label.toLowerCase()) ? this.subComponents.get(label.toLowerCase()).getValue() : undefined;
	}

	public aspectExists(label: string): boolean {
		return !isUndefined(this.subComponents.get(label.toLowerCase()));
	}

	public updateFunctionAspects(): void {
		this.subComponents.forEach(subComponent => {
		    if (subComponent.aspect.aspectType === AspectType.FUNCTION) {
		        subComponent.getValue();
		    }
		});
	}

	public save() {
		let characterSheet = {
			_id: this.characterSheetId,
		};
		let aspects: AspectData[] = [];
		for (let i = 0; i < this.aspects.length; i++) {
			let aspect = this.aspects[i];
			let aspectObj: AspectData = {
				_id: aspect._id,
				characterSheetId: this.characterSheetId,
				label: aspect.label,
				aspectType: aspect.aspectType,
				required: aspect.required,
				fontSize: aspect.fontSize,
				config: aspect.config,
			};
			if (aspect.aspectType === AspectType.CATEGORICAL) {
				aspectObj.items = (<CategoryComponent>this.getChildOf(aspect)).getCategories();
			}
			else if (aspect.aspectType === AspectType.BOOLEAN_LIST) {
				aspectObj.items = (<CheckboxListComponent>this.getChildOf(aspect)).getCheckboxLabels();
			}
			else if (aspect.aspectType === AspectType.FUNCTION) {
				aspectObj.ruleFunction = (<FunctionComponent>this.getChildOf(aspect)).getFunction();
			}
			aspects.push(aspectObj);
		}
		characterSheet['aspects'] = aspects;
		this.characterSheetRepository.saveCharacterSheet(characterSheet).subscribe();
	}

	private getChildOf(aspect: Aspect): SubComponentChild | undefined {
		return this.subComponents.get(aspect.label.toLowerCase()) ? this.subComponents.get(aspect.label.toLowerCase()).child : undefined;
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
}