import { Component, OnInit } from '@angular/core';
import { CharacterInterfaceService } from './character-interface.service';
import { CharacterInterfaceFactory } from './character-interface.factory';
import {
	CompactType,
	DisplayGrid,
	GridsterConfig,
	GridsterItem,
	GridsterItemComponentInterface,
	GridType
} from 'angular-gridster2';
import { CharacterMakerService } from '../maker/character-maker.service';

@Component({
	selector: 'character-grid',
	templateUrl: 'character-grid.component.html',
	styleUrls: ['character-grid.component.scss']
})
export class CharacterGridComponent implements OnInit {
	private characterService: CharacterMakerService;

	options: GridsterConfig;
	constructor(private characterServiceFactory: CharacterInterfaceFactory) {
	}

	public ngOnInit(): void {
		this.characterService = this.characterServiceFactory.getCharacterInterface() as CharacterMakerService;

		this.options = {
			gridType: GridType.VerticalFixed,
			compactType: CompactType.CompactLeft,
			margin: 10,
			outerMargin: true,
			outerMarginTop: null,
			outerMarginRight: null,
			outerMarginBottom: null,
			outerMarginLeft: null,
			mobileBreakpoint: 640,
			minCols: 10,
			maxCols: 10,
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
			scrollSensitivity: 10,
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
			pushDirections: {north: true, east: true, south: true, west: true},
			pushResizeItems: true,
			displayGrid: DisplayGrid.OnDragAndResize,
			disableWindowResize: false,
			disableWarnings: false,
			scrollToNewItems: false,
			itemResizeCallback: this.resizeItem,
			itemChangeCallback: this.changeItem,
		};
	}

	private resizeItem = (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => {
		const height = itemComponent.height;
		this.characterService.resizeAspect(item, height);
	};

	private changeItem = (item, itemComponent) => {
	};
}