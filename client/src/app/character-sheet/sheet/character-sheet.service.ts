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

@Injectable()
export class CharacterSheetService extends IsReadyService implements CharacterInterfaceService {
	public aspects: Aspect[];
	public characterSheet: CharacterSheetData;
	public readonly immutable = true;
	public gridOptions: GridsterConfig;

	private characterData: CharacterData;
	private aspectComponents: Map<string, CharacterAspectComponent>;

	constructor(private characterRepo: CharacterRepository) {
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
		this.setReady(true);
	}

	registerAspectComponent(aspectComponent: CharacterAspectComponent): void {
		this.aspectComponents.set(aspectComponent.aspect.label.toLowerCase(), aspectComponent);
		aspectComponent.child.setValue(this.characterData.values[aspectComponent.aspect.label]);
	}

	getAspectValue(aspectLabel: string): any {
		return this.aspectComponents.get(aspectLabel.toLowerCase()) ? this.aspectComponents.get(aspectLabel.toLowerCase()).getValue() : undefined;
	}

	updateFunctionAspects(): void {
		this.aspectComponents.forEach(subComponent => {
			if (subComponent.aspect.aspectType === AspectType.FUNCTION) {
				subComponent.getValue();
			}
		})
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

	public setTokenUrl(url: string): void {
		this.characterData.tokenUrl = url;
	}

	public save(): void {
		this.characterData.values = {};
		for (let aspect of this.aspects) {
			this.characterData.values[aspect.label] = this.getAspectValue(aspect.label);
		}

		this.characterRepo.saveCharacter(this.characterData).subscribe();
	}

}
