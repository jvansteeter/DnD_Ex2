import {BoardStateService} from '../services/board-state.service';
import {BoardTileService} from '../services/board-tile.service';
import {ViewMode} from '../shared/enum/view-mode';
import {BoardMode} from '../shared/enum/board-mode';
import {LightValue} from '../shared/enum/light-value';
import {AddPlayerComponent} from '../../temp/add-player.component';
import {BoardLightService} from '../services/board-light.service';
import {PlayerVisibilityMode} from "../shared/enum/player-visibility-mode";
import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';

@Component({
    selector: 'board-controller',
    templateUrl: 'board-controller.component.html',
    styleUrls: ['board-controller.component.scss']
})

export class BoardControllerComponent implements OnInit {
    public ViewMode = ViewMode;
    public BoardMode = BoardMode;
    public PlayerVisibilityMode = PlayerVisibilityMode;

    currentVisibility: string;
    visibilityModes: string[] = [
        'Global',
        'Team',
        'Player'
    ];

    currentInput: string;
    inputModes: string[] = [
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

    constructor(public boardStateService: BoardStateService,
                public boardLightService: BoardLightService,
                public ts: BoardTileService,
                private dialog: MatDialog) {
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
                this.currentInput = 'Player';
                break;
            case BoardMode.WALLS:
                this.currentInput = 'Walls';
                break;
            case BoardMode.DOORS:
                this.currentInput = 'Doors';
                break;
            case BoardMode.LIGHTS:
                this.currentInput = 'Lights';
                break;
            case BoardMode.TILES:
                this.currentInput = 'Tiles';
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

        switch (this.boardStateService.playerVisibilityMode) {
            case PlayerVisibilityMode.GLOBAL:
                this.currentVisibility = 'Global';
                break;
            case PlayerVisibilityMode.TEAM:
                this.currentVisibility = 'Team';
                break;
            case PlayerVisibilityMode.PLAYER:
                this.currentVisibility = 'Player';
                break;
        }
    }

    onVisibilityChange() {
        switch (this.currentVisibility) {
            case 'Global':
                this.boardStateService.playerVisibilityMode = PlayerVisibilityMode.GLOBAL;
                break;
            case 'Team':
                this.boardStateService.playerVisibilityMode = PlayerVisibilityMode.TEAM;
                break;
            case 'Player':
                this.boardStateService.playerVisibilityMode = PlayerVisibilityMode.PLAYER;
                break;
        }
        this.sync()
    }

    onInputChange() {
        switch (this.currentInput) {
            case 'Player' :
                this.boardStateService.source_click_location = null;
                this.boardStateService.board_edit_mode = BoardMode.PLAYER;
                this.boardStateService.doDiagonals = false;
                this.boardStateService.inputOffset = 0;
                break;
            case 'Walls' :
                this.boardStateService.board_edit_mode = BoardMode.WALLS;
                this.boardStateService.inputOffset = 0.2;
                this.boardStateService.doDiagonals = true;
                break;
            case 'Doors' :
                this.boardStateService.source_click_location = null;
                this.boardStateService.board_edit_mode = BoardMode.DOORS;
                this.boardStateService.inputOffset = 0.10;
                this.boardStateService.doDiagonals = true;
                break;
            case 'Lights' :
                this.boardStateService.source_click_location = null;
                this.boardStateService.board_edit_mode = BoardMode.LIGHTS;
                this.boardStateService.inputOffset = 0;
                this.boardStateService.doDiagonals = false;
                break;
            case 'Tiles' :
                this.boardStateService.source_click_location = null;
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
                this.boardStateService.source_click_location = null;
                this.boardStateService.board_view_mode = ViewMode.BOARD_MAKER;
                this.boardStateService.board_edit_mode = BoardMode.WALLS;
                this.boardStateService.do_pops = false;
                break;
            case 'Player View':
                this.boardStateService.source_click_location = null;
                this.boardStateService.board_view_mode = ViewMode.PLAYER;
                this.boardStateService.board_edit_mode = BoardMode.PLAYER;
                this.boardStateService.do_pops = true;
                this.boardStateService.show_health = false;
                break;
            case 'Game Master':
                this.boardStateService.source_click_location = null;
                this.boardStateService.board_view_mode = ViewMode.MASTER;
                this.boardStateService.board_edit_mode = BoardMode.PLAYER;
                this.boardStateService.do_pops = true;
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
        this.boardLightService.updateLightValues();
    }

    decreaseAmbientLight(): void {
        if (this.boardStateService.ambientLight === LightValue.FULL) {
            this.boardStateService.ambientLight = LightValue.DIM;
        } else if (this.boardStateService.ambientLight === LightValue.DIM) {
            this.boardStateService.ambientLight = LightValue.DARK;
        }
        this.boardLightService.updateLightValues();
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
