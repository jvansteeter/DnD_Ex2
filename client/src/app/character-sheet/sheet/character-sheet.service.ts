import { Injectable } from '@angular/core';
import { CharacterInterfaceService } from '../shared/character-interface.service';
import { Aspect, AspectType } from '../shared/aspect';
import { CharacterSheetData } from '../../../../../shared/types/rule-set/character-sheet.data';
import { CharacterData } from '../../../../../shared/types/character.data';
import { AspectData } from '../../../../../shared/types/rule-set/aspect.data';
import { isUndefined } from 'util';
import { CharacterRepository } from '../../repositories/character.repository';
import { CharacterAspectComponent } from '../shared/character-aspect.component';
import { CompactType, DisplayGrid, GridsterConfig, GridType } from "angular-gridster2";
import { IsReadyService } from '../../utilities/services/isReady.service';
import { RuleSetService } from '../../data-services/ruleSet.service';
import { AlertService } from '../../alert/alert.service';
import { isDefined } from '@angular/compiler/src/util';
import { TokenData } from '../../../../../shared/types/token.data';
import { AbilityData } from "../../../../../shared/types/ability.data";
import { Observable, Subject } from 'rxjs';
import { RuleService } from '../shared/rule/rule.service';
import { RuleData } from '../../../../../shared/types/rule.data';
import { AspectServiceInterface } from '../../data-services/aspect.service.interface';

@Injectable()
export class CharacterSheetService extends IsReadyService implements CharacterInterfaceService, AspectServiceInterface {
	public aspects: Aspect[];
	public characterSheet: CharacterSheetData;
	public readonly immutable = true;
	public gridOptions: GridsterConfig;
	public appliedRules: RuleData[];

	private characterData: CharacterData;
	private aspectComponents: Map<string, CharacterAspectComponent>;
	private modifiersChangeSubject: Subject<void> = new Subject();
	private updateFunctionSubject: Subject<void> = new Subject();

	constructor(private characterRepo: CharacterRepository,
	            private ruleSetService: RuleSetService,
	            private ruleService: RuleService,
	            private alertService: AlertService) {
		super();
	}

	init(): void {
		this.aspects = [];
		this.aspectComponents = new Map<string, CharacterAspectComponent>();

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
				enabled: false,
			},
			resizable: {
				enabled: false,
			},
			swap: false,
			pushItems: false,
			disablePushOnDrag: true,
			disablePushOnResize: true,
			pushDirections: {north: true, east: true, south: true, west: true},
			pushResizeItems: false,
			displayGrid: DisplayGrid.OnDragAndResize,
			disableWindowResize: false,
			disableWarnings: true,
			scrollToNewItems: false,
		};
		this.ruleService.setAspectService(this);
		this.setReady(true);
	}

	registerAspectComponent(aspectComponent: CharacterAspectComponent): void {
		this.aspectComponents.set(aspectComponent.aspect.label.toLowerCase(), aspectComponent);
		aspectComponent.child.setValue(this.characterData.values[aspectComponent.aspect.label]);
	}

	getAspectValue(aspectLabel: string, playerId?: string): any {
		return this.aspectComponents.get(aspectLabel.toLowerCase()) ? this.aspectComponents.get(aspectLabel.toLowerCase()).getValue() : undefined;
	}

	public getRuleModifiers(aspect: Aspect): Map<string, any> {
		this.updateAppliedRules();
		return this.ruleService.getRuleModifiers(aspect, this.characterSheet.rules);
	}

	updateFunctionAspects(): void {
		this.updateAppliedRules();
		this.updateFunctionSubject.next();
		this.modifiersChangeSubject.next();
	}

	public updateFunctionAspectsObservable(): Observable<void> {
		return this.updateFunctionSubject.asObservable();
	}

	public setCharacterData(data: CharacterData): void {
		this.characterData = data;
		this.characterSheet = this.characterData.characterSheet;
		if (isDefined(this.characterData.ruleSetId)) {
			this.ruleSetService.setRuleSetId(this.characterData.ruleSetId);
		}
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
		this.aspects.sort((a: Aspect, b: Aspect) => {
			if (a.config.y !== b.config.y) {
				return a.config.y - b.config.y;
			}
			return a.config.x - b.config.x;
		});
		if (isUndefined(this.characterData.values)) {
			this.characterData.values = {};
		}
	}

	removeComponent(aspect: Aspect): void {

	}

	public setTokens(tokens: TokenData[]): void {
		this.characterData.tokens = tokens;
	}

	public setAbilities(abilities: AbilityData[]): void {
		this.characterData.abilities = abilities;
	}

	get modifiersChangeObservable(): Observable<void> {
		return this.modifiersChangeSubject.asObservable();
	}

	public save(): void {
		this.characterData.values = {};
		for (let aspect of this.aspects) {
			this.characterData.values[aspect.label] = this.getAspectValue(aspect.label);
		}

		this.characterRepo.saveCharacter(this.characterData).subscribe(() => {
			this.alertService.showAlert('Character Saved')
		});
	}

	private updateAppliedRules(): void {
		this.appliedRules = [];
		for (const rule of this.characterSheet.rules) {
			if (this.ruleService.evaluationRuleCondition(rule.condition)) {
				this.appliedRules.push(rule);
			}
		}
	}
}
