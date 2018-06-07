import {Component, OnInit} from '@angular/core';
import {BoardStateService} from '../services/board-state.service';
import {BoardService} from '../services/board.service';
import {TileService} from '../services/tile.service';
import {ViewMode} from '../shared/view-mode';
import {BoardMode} from '../shared/board-mode';
import {LightValue} from '../shared/light-value';
import { MatDialog } from '@angular/material';
import { AddPlayerComponent } from '../../temp/add-player.component';

@Component({
    selector: 'board-controller',
    templateUrl: 'board-controller.component.html',
    styleUrls: ['board-controller.component.scss']
})

export class BoardControllerComponent implements OnInit{
    public ViewMode = ViewMode;
    public BoardMode = BoardMode;

    currentMode: string;
    modes: string[] = [
        'Player',
        'Walls',
        'Doors',
        'Lights',
        'Tiles'
    ];

    currentView: string;
    viewModes: string[] = [
        'Board Maker',
        'Player View',
        'Game Master'
    ];

    tileUrls: string[] = [
        'resources/images/map-tiles/coal_ore.jpg',
        'resources/images/map-tiles/cobolt_ore.jpg',
        'resources/images/map-tiles/diamond_ore.jpg',
        'resources/images/map-tiles/emerald_ore.jpg',
        'resources/images/map-tiles/iron_ore.jpg',
        'resources/images/map-tiles/gold.jpg',

        'resources/images/map-tiles/cobolt_floor.jpg',
        'resources/images/map-tiles/diamond_floor.jpg',
        'resources/images/map-tiles/emerald_floor.jpg',
        'resources/images/map-tiles/gold_floor.jpg',
        'resources/images/map-tiles/iron_floor.jpg',

        'resources/images/map-tiles/brick.jpg',
        'resources/images/map-tiles/cobblestone.jpg',
        'resources/images/map-tiles/old_stone.jpg',
        'resources/images/map-tiles/old_stone_moss.jpg',
        'resources/images/map-tiles/old_stone_moss_decor.jpg',
        'resources/images/map-tiles/gravel.jpg',
        'resources/images/map-tiles/stone.jpg',
        'resources/images/map-tiles/stone_decor1.jpg',
        'resources/images/map-tiles/stone_tile.jpg',
        'resources/images/map-tiles/stone_tile_old.jpg',

        'resources/images/map-tiles/dirt.jpg',
        'resources/images/map-tiles/mud.jpg',
        'resources/images/map-tiles/grass.jpg',
        'resources/images/map-tiles/lilly_pad.jpg',
        'resources/images/map-tiles/lilly_pad2.jpg',

        'resources/images/map-tiles/sand.jpg',
        'resources/images/map-tiles/sandstone.jpg',
        'resources/images/map-tiles/sandstone_decor1.jpg',
        'resources/images/map-tiles/sandstone_decor2.jpg',
        'resources/images/map-tiles/sandstone_tile.jpg',

        'resources/images/map-tiles/wood1.jpg',
        'resources/images/map-tiles/wood2.jpg',
        'resources/images/map-tiles/crate.jpg',
    ];

    constructor(
        public boardService: BoardService,
        public boardStateService: BoardStateService,
        public ts: TileService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.sync();
    }

    showModeControls(): boolean {
        return this.boardStateService.board_view_mode === ViewMode.BOARD_MAKER;
    }

    showLightControls(): boolean {
        return this.boardStateService.board_view_mode === ViewMode.BOARD_MAKER || this.boardStateService.board_view_mode === ViewMode.MASTER;
    }

    sync() {
        switch (this.boardStateService.board_edit_mode) {
            case BoardMode.PLAYER:
                this.currentMode = 'Player';
                break;
            case BoardMode.WALLS:
                this.currentMode = 'Walls';
                break;
            case BoardMode.DOORS:
                this.currentMode = 'Doors';
                break;
            case BoardMode.LIGHTS:
                this.currentMode = 'Lights';
                break;
            case BoardMode.TILES:
                this.currentMode = 'Tiles';
                break;
        }

        switch (this.boardStateService.board_view_mode) {
            case ViewMode.BOARD_MAKER:
                this.currentView = 'Board Maker';
                break;
            case ViewMode.PLAYER:
                this.currentView = 'Player View';
                break;
            case ViewMode.MASTER:
                this.currentView = 'Game Master';
                break;
        }
    }

    onModeChange() {
        switch (this.currentMode) {
            case 'Player' :
                this.boardService.source_click_location = null;
                this.boardStateService.board_edit_mode = BoardMode.PLAYER;
                this.boardStateService.doDiagonals = false;
                this.boardStateService.inputOffset = 0;
                break;
            case 'Walls' :
                this.boardStateService.board_edit_mode = BoardMode.WALLS;
                this.boardStateService.inputOffset = 0.12;
                this.boardStateService.doDiagonals = true;
                break;
            case 'Doors' :
                this.boardService.source_click_location = null;
                this.boardStateService.board_edit_mode = BoardMode.DOORS;
                this.boardStateService.inputOffset = 0.10;
                this.boardStateService.doDiagonals = true;
                break;
            case 'Lights' :
                this.boardService.source_click_location = null;
                this.boardStateService.board_edit_mode = BoardMode.LIGHTS;
                this.boardStateService.inputOffset = 0;
                this.boardStateService.doDiagonals = false;
                break;
            case 'Tiles' :
                this.boardService.source_click_location = null;
                this.boardStateService.board_edit_mode = BoardMode.TILES;
                this.boardStateService.inputOffset = 0;
                this.boardStateService.doDiagonals = false;
                break;
        }
        this.sync()
    }

    onViewChange() {
        switch (this.currentView) {
            case 'Board Maker':
                this.boardService.source_click_location = null;
                this.boardStateService.board_view_mode = ViewMode.BOARD_MAKER;
                this.boardStateService.board_edit_mode = BoardMode.WALLS;
                this.boardStateService.do_pops = false;
                this.boardStateService.show_health = true;
                break;
            case 'Player View':
                this.boardService.source_click_location = null;
                this.boardStateService.board_view_mode = ViewMode.PLAYER;
                this.boardStateService.board_edit_mode = BoardMode.PLAYER;
                this.boardStateService.do_pops = true;
                this.boardStateService.show_health = false;
                break;
            case 'Game Master':
                this.boardService.source_click_location = null;
                this.boardStateService.board_view_mode = ViewMode.MASTER;
                this.boardStateService.board_edit_mode = BoardMode.PLAYER;
                this.boardStateService.do_pops = true;
                this.boardStateService.show_health = true;
                break;
        }
        this.sync()
    }

    mapOpacitySliderInput(event) {
        this.boardStateService.board_maker_map_opacity = event.value;
    }

    increaseAmbientLight(): void {
        if (this.boardStateService.ambientLight === LightValue.DARK) {
            this.boardStateService.ambientLight = LightValue.DIM;
        } else if (this.boardStateService.ambientLight === LightValue.DIM) {
            this.boardStateService.ambientLight = LightValue.FULL;
        }
        this.boardService.updateLightValues();
    }

    decreaseAmbientLight(): void {
        if (this.boardStateService.ambientLight === LightValue.FULL) {
            this.boardStateService.ambientLight = LightValue.DIM;
        } else if (this.boardStateService.ambientLight === LightValue.DIM) {
            this.boardStateService.ambientLight = LightValue.DARK;
        }
        this.boardService.updateLightValues();
    }

    getLightValue(): string {
        switch (this.boardStateService.ambientLight) {
            case LightValue.DARK:
                return 'Dark';
            case LightValue.DIM:
                return 'Dim';
            case LightValue.FULL:
                return 'Full';
        }
    }

    updateTile(id: string) {
        this.ts.activeTileUrl = id;
    }

		addPlayer(): void {
    	  this.dialog.open(AddPlayerComponent);
		}
}
