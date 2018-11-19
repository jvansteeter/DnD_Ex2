import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { CharacterInterfaceService } from './character-interface.service';
import { CharacterInterfaceFactory } from './character-interface.factory';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';

@Component({
	selector: 'character-grid',
	templateUrl: 'character-grid.component.html',
	styleUrls: ['character-grid.component.scss', 'character-sheet.scss']
})
export class CharacterGridComponent implements OnInit, OnDestroy {
	private removeComponentSubscription: Subscription;
	private characterService: CharacterInterfaceService;

	options: GridsterConfig;
	dashboard: Array<GridsterItem>;

	constructor(private characterServiceFactory: CharacterInterfaceFactory,
							private elementRef: ElementRef,
							private renderer: Renderer2) {
	}

	public ngOnInit(): void {
		this.characterService = this.characterServiceFactory.getCharacterInterface();
		this.removeComponentSubscription = this.characterService.removeComponentObservable.subscribe(() => this.changeHeight());

		this.options = {
			gridType: GridType.Fit,
			compactType: CompactType.None,
			margin: 10,
			outerMargin: true,
			outerMarginTop: null,
			outerMarginRight: null,
			outerMarginBottom: null,
			outerMarginLeft: null,
			mobileBreakpoint: 640,
			minCols: 1,
			maxCols: 100,
			minRows: 1,
			maxRows: 100,
			maxItemCols: 100,
			minItemCols: 1,
			maxItemRows: 100,
			minItemRows: 1,
			maxItemArea: 2500,
			minItemArea: 1,
			defaultItemCols: 1,
			defaultItemRows: 1,
			fixedColWidth: 105,
			fixedRowHeight: 105,
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
			swap: false,
			pushItems: true,
			disablePushOnDrag: false,
			disablePushOnResize: false,
			pushDirections: {north: true, east: true, south: true, west: true},
			pushResizeItems: false,
			displayGrid: DisplayGrid.Always,
			disableWindowResize: false,
			disableWarnings: false,
			scrollToNewItems: false
		};

		this.dashboard = [
			{cols: 2, rows: 1, y: 0, x: 0},
			{cols: 2, rows: 2, y: 0, x: 2}
		];
	}

	public ngOnDestroy(): void {
		this.removeComponentSubscription.unsubscribe();
	}

	public changeHeight(): void {
		this.renderer.setStyle(this.elementRef.nativeElement, 'height', this.characterService.getGridHeight() + 'px');
	}

	changedOptions() {
		if (this.options.api && this.options.api.optionsChanged) {
			this.options.api.optionsChanged();
		}
	}

	removeItem($event, item) {
		$event.preventDefault();
		$event.stopPropagation();
		this.dashboard.splice(this.dashboard.indexOf(item), 1);
	}

	addItem() {
		this.dashboard.push({x: 0, y: 0, cols: 1, rows: 1});
	}
}