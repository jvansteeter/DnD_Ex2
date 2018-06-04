import {BrowserModule} from '@angular/platform-browser';
import {MatCheckboxModule, MatRadioModule, MatSliderModule} from '@angular/material';
import {NgModule} from '@angular/core';
import {MapRendererComponent} from "./renderer/map-renderer/map-renderer.component";
import {GridRendererComponent} from "./renderer/grid-renderer/grid-renderer";
import {BoardZoneComponent} from "./board-zone.component";
import {HoverRendererComponent} from "./renderer/hover-renderer/hover-renderer.component";
import {TileRendererComponent} from "./renderer/tile-renderer/tile-renderer.component";
import {LightRendererComponent} from "./renderer/light-renderer/light-renderer.component";
import {WallRendererComponent} from "./renderer/wall-renderer/wall-renderer.component";
import {HighlightRendererComponent} from "./renderer/highlight-renderer/highlight-renderer.component";
import {MouseWheelDirective} from "./mousewheel.directive";
import {BoardControllerComponent} from "./board-control/board-controller.component";
import {FormsModule} from "@angular/forms";
import {BoardService} from "./services/board.service";
import {BoardStateService} from "./services/board-state.service";
import {BoardCanvasService} from "./services/board-canvas-service";
import {WallService} from "./services/wall.service";
import {TileService} from "./services/tile.service";
import {BoardMapComponent} from './board-map/board-map.component';
import {TokenRendererComponent} from './renderer/token-renderer/token-renderer.component';
import {PopService} from "./pop/pop.service";
import {PopRootComponent} from "./pop/pop-root.component";
import {NpcPopComponent} from "./pop/npcPop/npc-pop.component";


@NgModule({
    declarations: [
        BoardZoneComponent,
        PopRootComponent,
        BoardControllerComponent,
        BoardMapComponent,
        MouseWheelDirective,
        MapRendererComponent,
        GridRendererComponent,
        HoverRendererComponent,
        TileRendererComponent,
        LightRendererComponent,
        WallRendererComponent,
        HighlightRendererComponent,
        TokenRendererComponent,
        NpcPopComponent
    ],
    imports: [
        BrowserModule,
        MatRadioModule,
        MatCheckboxModule,
        FormsModule,
        MatSliderModule
    ],
    providers: [
        BoardService,
        PopService,
        BoardStateService,
        BoardCanvasService,
        WallService,
        TileService
    ],
    entryComponents: [
        NpcPopComponent
    ],
    bootstrap: [],
    exports: [
        BoardZoneComponent
    ]
})
export class BoardModule {
}
