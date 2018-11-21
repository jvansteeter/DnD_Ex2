import { Injectable } from '@angular/core';
import { Aspect, AspectType } from '../shared/aspect';
import { CategoryComponent } from '../shared/subcomponents/category/category.component';
import { CheckboxListComponent } from '../shared/subcomponents/checkbox-list/checkbox-list.component';
import { FunctionComponent } from '../shared/subcomponents/function/function.component';
import { SubComponentChild } from '../shared/subcomponents/sub-component-child';
import { CharacterInterfaceService } from '../shared/character-interface.service';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { isUndefined } from 'util';
import { AspectData } from '../../../../../shared/types/rule-set/aspect.data';
import { Observable, Subject } from 'rxjs';
import { AlertService } from '../../alert/alert.service';
import { CharacterSheetData } from '../../../../../shared/types/rule-set/character-sheet.data';
import { CharacterSheetTooltipData } from '../../../../../shared/types/rule-set/character-sheet-tooltip.data';
import { CharacterAspectComponent } from '../shared/character-aspect.component';
import { GridsterItem } from 'angular-gridster2';

@Injectable()
export class CharacterMakerService implements CharacterInterfaceService {
	public characterSheet: CharacterSheetData;

	private aspectMap: Map<GridsterItem, Aspect>;
	private aspectComponents: Map<string, CharacterAspectComponent>;
	private removeComponentSubject = new Subject<void>();
	private registerAspectComponentSubject = new Subject<CharacterAspectComponent>();
	private readonly materialConstant = 2.71875;

	public readonly immutable = false;

	constructor(private characterSheetRepository: CharacterSheetRepository,
	            private alertService: AlertService) {
		this.init();
	}

	public init(): void {
		this.aspectComponents = new Map<string, CharacterAspectComponent>();
		this.aspectMap = new Map<GridsterItem, Aspect>();
	}

	public setCharacterSheet(sheet: CharacterSheetData): void {
		this.characterSheet = sheet;
		this.init();
	}

	public addComponent(aspect: Aspect): void {
		if (!isUndefined(this.aspectComponents.get(aspect.label.toLowerCase()))) {
			console.error('aspect with that name already exists');
			this.alertService.showAlert('Aspect with that name already exists');
			return;
		}
		this.aspectMap.set(aspect.config, aspect);
	}

	public removeComponent(aspect: Aspect): void {
		this.aspectMap.delete(aspect.config);
		this.aspectComponents.delete(aspect.label.toLowerCase());
		setTimeout(() => this.removeComponentSubject.next());
	}

	get removeComponentObservable(): Observable<void> {
		return this.removeComponentSubject.asObservable();
	}

	public registerAspectComponent(subComponent: CharacterAspectComponent): void {
		this.aspectComponents.set(subComponent.aspect.label.toLowerCase(), subComponent);
		this.registerAspectComponentSubject.next(subComponent);
	}

	get registerAspectComponentObservable(): Observable<CharacterAspectComponent> {
		return this.registerAspectComponentSubject.asObservable();
	}

	public getAspectValue(aspectLabel: string): any {
		return this.aspectComponents.get(aspectLabel.toLowerCase()) ? this.aspectComponents.get(aspectLabel.toLowerCase()).getValue() : undefined;
	}

	public setAspectValue(aspectLabel: string, value: any): void {
		this.aspectComponents.get(aspectLabel.toLowerCase()).child.setValue(value);
	}

	public getAspect(aspectLabel: string): Aspect {
		return this.aspectComponents.get(aspectLabel.toLowerCase()).aspect;
	}

	public updateFunctionAspects(): void {
		this.aspectComponents.forEach(subComponent => {
			if (subComponent.aspect.aspectType === AspectType.FUNCTION) {
				subComponent.getValue();
			}
		});
	}

	public save() {
		let characterSheet = JSON.parse(JSON.stringify(this.characterSheet));
		let aspects: AspectData[] = [];
		for (let aspect of this.aspects) {
			let aspectObj: AspectData = {
				_id: aspect._id,
				characterSheetId: this.characterSheet._id,
				label: aspect.label,
				aspectType: aspect.aspectType,
				required: aspect.required,
				isPredefined: aspect.isPredefined,
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

	public initAspects(aspects: AspectData[]): void {
		aspects.forEach((aspectObj: AspectData) => {
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

			this.aspectMap.set(aspect.config, aspect);
		});
	}

	public getGridHeight(): number {
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

	public getTooltipAspects(): Aspect[] {
		let result = [];
		for (let aspect of this.aspects) {
			if (aspect.aspectType === AspectType.TEXT ||
					aspect.aspectType === AspectType.NUMBER ||
					aspect.aspectType === AspectType.BOOLEAN ||
					aspect.aspectType === AspectType.CATEGORICAL ||
					aspect.aspectType === AspectType.CURRENT_MAX ||
					aspect.aspectType === AspectType.FUNCTION) {
				result.push(aspect);
			}
		}

		return result;
	}

	get characterTooltipConfig(): CharacterSheetTooltipData {
		if (isUndefined(this.characterSheet.tooltipConfig)) {
			this.characterSheet.tooltipConfig = {
				aspects: [] = []
			} as CharacterSheetTooltipData;
		}
		return this.characterSheet.tooltipConfig;
	}

	private getChildOf(aspect: Aspect): SubComponentChild | undefined {
		return this.aspectComponents.get(aspect.label.toLowerCase()) ? this.aspectComponents.get(aspect.label.toLowerCase()).child : undefined;
	}

	get aspects(): Aspect[] {
		return [...this.aspectMap.values()];
	}

	set aspects(value) {
		// do nothing
	}

	public resizeAspect(item: GridsterItem, height: number): void {
		const aspect = this.aspectMap.get(item);
		switch (aspect.aspectType) {
			case AspectType.TEXT: {
				const fontSize = height / (this.materialConstant * 1.2);
				aspect.fontSize = fontSize;
				break;
			}
			case AspectType.NUMBER: {
				const fontSize = height / (this.materialConstant * 1.2);
				aspect.fontSize = fontSize;
				break;
			}
			case AspectType.CATEGORICAL: {
				const fontSize = height / (this.materialConstant * 1.2);
				aspect.fontSize = fontSize;
				break;
			}
			case AspectType.BOOLEAN: {
				const fontSize = (height / 25) * 16;
				aspect.fontSize = fontSize;
				break;
			}
		}
	}
}
