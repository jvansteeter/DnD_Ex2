import { Injectable } from '@angular/core';
import { Aspect, AspectType } from '../shared/aspect';
import { CategoryComponent } from '../shared/subcomponents/category/category.component';
import { CheckboxListComponent } from '../shared/subcomponents/checkbox-list/checkbox-list.component';
import { FunctionComponent } from '../shared/subcomponents/function/function.component';
import { SubComponentChild } from '../shared/subcomponents/sub-component-child';
import { CharacterInterfaceService } from '../shared/character-interface.service';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { isNullOrUndefined, isUndefined } from 'util';
import { AspectData } from '../../../../../shared/types/rule-set/aspect.data';
import { Observable, Subject, Subscription } from 'rxjs';
import { AlertService } from '../../alert/alert.service';
import { CharacterSheetData } from '../../../../../shared/types/rule-set/character-sheet.data';
import { CharacterSheetTooltipData } from '../../../../../shared/types/rule-set/character-sheet-tooltip.data';
import { CharacterAspectComponent } from '../shared/character-aspect.component';
import {
	CompactType,
	DisplayGrid,
	GridsterConfig,
	GridsterItem,
	GridsterItemComponentInterface,
	GridType
} from 'angular-gridster2';
import { TextListComponent } from "../shared/subcomponents/text-list/text-list.component";
import { IsReadyService } from '../../utilities/services/isReady.service';
import { mergeMap } from 'rxjs/operators';
import { RuleSetService } from '../../data-services/ruleSet.service';
import { RuleModuleAspects } from '../../../../../shared/predefined-aspects.enum';
import { RulesConfigService } from '../../data-services/rules-config.service';
import { AbilityData } from '../../../../../shared/types/ability.data';
import { RuleData } from '../../../../../shared/types/rule.data';
import { isDefined } from '@angular/compiler/src/util';
import { RuleService } from '../shared/rule/rule.service';
import { AspectServiceInterface } from '../../data-services/aspect.service.interface';

@Injectable()
export class CharacterMakerService extends IsReadyService implements CharacterInterfaceService, AspectServiceInterface {
	private characterSheetId: string;
	private aspectMap: Map<GridsterItem, Aspect>;
	private aspectComponents: Map<string, CharacterAspectComponent>;
	private removeComponentSubject = new Subject<void>();
	private registerAspectComponentSubject = new Subject<CharacterAspectComponent>();
	private readonly materialConstant = 2.71875;
	private modifiersChangeSubject: Subject<void> = new Subject();

	public readonly immutable = false;
	public ruleModuleAspects: Aspect[] = [];
	public gridOptions: GridsterConfig;
	public characterSheet: CharacterSheetData;

	constructor(private characterSheetRepo: CharacterSheetRepository,
	            private alertService: AlertService,
	            private ruleSetService: RuleSetService,
	            private ruleService: RuleService,
	            private rulesConfigService: RulesConfigService) {
		super();
	}

	public init(): void {
		this.aspectComponents = new Map<string, CharacterAspectComponent>();
		this.aspectMap = new Map<GridsterItem, Aspect>();

		this.gridOptions = {
			gridType: GridType.VerticalFixed,
			compactType: CompactType.CompactUp,
			margin: 10,
			outerMargin: true,
			outerMarginTop: null,
			outerMarginRight: null,
			outerMarginBottom: null,
			outerMarginLeft: null,
			mobileBreakpoint: 640,
			minCols: 20,
			maxCols: 20,
			minRows: 1,
			maxRows: 100,
			maxItemCols: 10,
			minItemCols: 1,
			maxItemRows: 100,
			minItemRows: 1,
			maxItemArea: 2500,
			minItemArea: 1,
			defaultItemCols: 1,
			defaultItemRows: 1,
			fixedColWidth: 50,
			fixedRowHeight: 25,
			keepFixedHeightInMobile: false,
			keepFixedWidthInMobile: false,
			scrollSensitivity: 1,
			scrollSpeed: 20,
			enableEmptyCellClick: false,
			enableEmptyCellContextMenu: false,
			enableEmptyCellDrop: false,
			enableEmptyCellDrag: false,
			emptyCellDragMaxCols: 50,
			emptyCellDragMaxRows: 50,
			ignoreMarginInRow: false,
			draggable: {
				enabled: true,
			},
			resizable: {
				enabled: true,
			},
			swap: true,
			pushItems: true,
			disablePushOnDrag: false,
			disablePushOnResize: false,
			pushDirections: {north: false, east: true, south: true, west: false},
			pushResizeItems: false,
			displayGrid: DisplayGrid.OnDragAndResize,
			disableWindowResize: false,
			disableWarnings: true,
			scrollToNewItems: false,
			itemResizeCallback: this.resizeItem,
		};

		const isReadySub: Subscription = this.characterSheetRepo.getCharacterSheet(this.characterSheetId).pipe(
				mergeMap((sheet: CharacterSheetData) => {
					this.characterSheet = sheet;
					if (isDefined(this.characterSheet.rules)) {
						this.setRules(this.characterSheet.rules);
					}
					this.initAspects(sheet.aspects);
					this.ruleSetService.setRuleSetId(this.characterSheet.ruleSetId);
					return this.ruleSetService.isReadyObservable;
				})
		).subscribe((isReady: boolean) => {
			if (isReady) {
				this.rulesConfigService.setRuleSetService(this.ruleSetService);
				this.rulesConfigService.setRuleSetRuleMode();
				this.ruleService.setAspectService(this);
				isReadySub.unsubscribe();
				this.initRuleModuleAspects();
				this.setReady(true);
			}
		});
	}

	public unInit(): void {
		super.unInit();
		delete this.aspectMap;
		delete this.aspectComponents;
	}

	public setCharacterSheetId(id: string): void {
		this.characterSheetId = id;
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
		this.removeTooltipAspect(aspect.label);
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

	public getAspectValue(aspectLabel: string, playerId?: string): any {
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

	public setAbilities(abilities: AbilityData[]): void {
		this.characterSheet.abilities = abilities;
	}

	public setRules(rules: RuleData[]): void {
		this.characterSheet.rules = rules;
		this.updateFunctionAspects();
		this.modifiersChangeSubject.next();
	}

	public getRuleModifiers(aspect: Aspect): any {
		return this.ruleService.getRuleModifiers(aspect, this.characterSheet.rules);
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
			else if (aspect.aspectType === AspectType.TEXT_LIST) {
				let items = [];
				for (let i in (<TextListComponent>this.getChildOf(aspect)).items) {
					items.push({value: ''});
				}
				aspectObj.items = items;
			}
			else if (aspect.aspectType === AspectType.FUNCTION) {
				aspectObj.ruleFunction = (<FunctionComponent>this.getChildOf(aspect)).getFunction();
			}
			aspects.push(aspectObj);
		}
		characterSheet['aspects'] = aspects;
		this.characterSheetRepo.saveCharacterSheet(characterSheet).subscribe(() => {
			this.alertService.showAlert('Character Sheet Saved');
		});
	}

	public initAspects(aspects: AspectData[]): void {
		for (let aspectObj of aspects) {
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
		}
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

	get modifiersChangeObservable(): Observable<void> {
		return this.modifiersChangeSubject.asObservable();
	}

	get characterTooltipConfig(): CharacterSheetTooltipData {
		if (isUndefined(this.characterSheet.tooltipConfig)) {
			this.characterSheet.tooltipConfig = {
				aspects: [] = []
			} as CharacterSheetTooltipData;
		}
		return this.characterSheet.tooltipConfig;
	}

	get abilities(): AbilityData[] {
		if (isNullOrUndefined(this.characterSheet.abilities)) {
			return [];
		}

		return this.characterSheet.abilities;
	}

	get rules(): RuleData[] {
		if (isNullOrUndefined(this.characterSheet.rules)) {
			return [];
		}

		return this.characterSheet.rules;
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
		if (isUndefined(aspect)) {
			return;
		}
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
			case AspectType.CURRENT_MAX: {
				const fontSize = height / (this.materialConstant * 1.64);
				aspect.fontSize = fontSize;
				break;
			}
			case AspectType.FUNCTION: {
				const fontSize = height / (this.materialConstant * 1.2);
				aspect.fontSize = fontSize;
				break;
			}
		}
	}

	public getAspectByLabel(aspectLabel: string): Aspect {
		return this.aspectComponents.get(aspectLabel.toLowerCase()).aspect;
	}

	private initRuleModuleAspects(): void {
		this.ruleModuleAspects = [];
		const aspectsToInit = [];

		// Speed
		let speedAspect = this.getAspectFromMapByLabel(RuleModuleAspects.SPEED);
		if (isUndefined(speedAspect)) {
			speedAspect = new Aspect(RuleModuleAspects.SPEED, AspectType.NUMBER, true, true);
			aspectsToInit.push(speedAspect)
		}
		this.ruleModuleAspects.push(speedAspect);

		// Light & Vision
		let visionAspect = this.getAspectFromMapByLabel(RuleModuleAspects.VISION);
		let darkVisionAspect = this.getAspectFromMapByLabel(RuleModuleAspects.DARK_VISION);
		if (this.rulesConfigService.hasLightAndVision) {
			if (isUndefined(visionAspect)) {
				visionAspect = new Aspect(RuleModuleAspects.VISION, AspectType.NUMBER, true, true);
				aspectsToInit.push(visionAspect);
			}
			if (isUndefined(darkVisionAspect)) {
				darkVisionAspect = new Aspect(RuleModuleAspects.DARK_VISION, AspectType.BOOLEAN, true, true);
				aspectsToInit.push(darkVisionAspect);
			}
			this.ruleModuleAspects.push(visionAspect);
			this.ruleModuleAspects.push(darkVisionAspect);
		}
		else {
			if (!isUndefined(visionAspect) && visionAspect.isPredefined) {
				this.aspectMap.delete(visionAspect.config);
			}
			if (!isUndefined(darkVisionAspect) && darkVisionAspect.isPredefined) {
				this.aspectMap.delete(visionAspect.config);
			}
		}

		// Hidden & Sneaking
		let hiddenAspect = this.getAspectFromMapByLabel(RuleModuleAspects.HIDDEN);
		let stealthAspect = this.getAspectFromMapByLabel(RuleModuleAspects.STEALTH);
		let perceptionAspect = this.getAspectFromMapByLabel(RuleModuleAspects.PERCEPTION);
		if (this.rulesConfigService.hasHiddenAndSneaking) {
			if (isUndefined(hiddenAspect)) {
				hiddenAspect = new Aspect(RuleModuleAspects.HIDDEN, AspectType.BOOLEAN, false, true);
				aspectsToInit.push(hiddenAspect);
				this.addTooltipAspect('visibility_off', hiddenAspect);
			}
			if (isUndefined(stealthAspect)) {
				stealthAspect = new Aspect(RuleModuleAspects.STEALTH, AspectType.NUMBER, false, true);
				aspectsToInit.push(stealthAspect);
				this.addTooltipAspect('brightness_3', stealthAspect);
			}
			if (isUndefined(perceptionAspect)) {
				perceptionAspect = new Aspect(RuleModuleAspects.PERCEPTION, AspectType.NUMBER, false, true);
				aspectsToInit.push(perceptionAspect);
				this.addTooltipAspect('visibility', perceptionAspect);
			}
			this.ruleModuleAspects.push(hiddenAspect);
			this.ruleModuleAspects.push(stealthAspect);
			this.ruleModuleAspects.push(perceptionAspect);
		}
		else {
			if (!isUndefined(hiddenAspect) && hiddenAspect.isPredefined) {
				this.aspectMap.delete(hiddenAspect.config);
				this.removeTooltipAspect(hiddenAspect.label);
			}
			if (!isUndefined(stealthAspect) && stealthAspect.isPredefined) {
				this.aspectMap.delete(stealthAspect.config);
				this.removeTooltipAspect(stealthAspect.label);
			}
			if (!isUndefined(perceptionAspect) && perceptionAspect.isPredefined) {
				this.aspectMap.delete(perceptionAspect.config);
				this.removeTooltipAspect(perceptionAspect.label);
			}
		}

		// Conditions
		let conditionsAspect = this.getAspectFromMapByLabel(RuleModuleAspects.CONDITIONS);
		if (this.rulesConfigService.hasConditions) {
			if (isUndefined(conditionsAspect)) {
				conditionsAspect = new Aspect(RuleModuleAspects.CONDITIONS, AspectType.CONDITIONS, true, true);
				aspectsToInit.push(conditionsAspect);
				this.addTooltipAspect('warning', conditionsAspect);
			}
			this.ruleModuleAspects.push(conditionsAspect);
		}
		else {
			if (!isUndefined(conditionsAspect) && conditionsAspect.isPredefined) {
				this.aspectMap.delete(conditionsAspect.config);
				this.removeTooltipAspect(conditionsAspect.label);
			}
		}

		this.initAspects(aspectsToInit);
	}

	private addTooltipAspect(icon: string, aspect: Aspect): void {
		this.characterSheet.tooltipConfig.aspects.push({
			icon: icon,
			aspect: aspect,
		});
	}

	private removeTooltipAspect(aspectLabel: string): void {
		for (let i = 0; i < this.characterSheet.tooltipConfig.aspects.length; i++) {
			if (this.characterSheet.tooltipConfig.aspects[i].aspect.label === aspectLabel) {
				this.characterSheet.tooltipConfig.aspects.splice(i, 1);
				return;
			}
		}
	}

	private getAspectFromMapByLabel(label: string): Aspect {
		for (let aspect of this.aspectMap.values()) {
			if (aspect.label.toLowerCase() === label.toLowerCase()) {
				return aspect;
			}
		}
		return undefined;
	}

	private resizeItem = (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => {
		const height = itemComponent.height;
		this.resizeAspect(item, height);
	};
}
