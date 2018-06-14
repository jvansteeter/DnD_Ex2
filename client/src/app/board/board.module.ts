import {BrowserModule} from '@angular/platform-browser';
import {MatButtonModule, MatCheckboxModule, MatRadioModule, MatSliderModule} from '@angular/material';
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
import {BoardStateService} from "./services/board-state.service";
import {BoardCanvasService} from "./services/board-canvas.service";
import {BoardWallService} from "./services/board-wall.service";
import {BoardTileService} from "./services/board-tile.service";
import {BoardMapComponent} from './board-map/board-map.component';
import {TokenRendererComponent} from './renderer/token-renderer/token-renderer.component';
import {PopService} from "./pop/pop.service";
import {PopRootComponent} from "./pop/pop-root.component";
import {NpcPopComponent} from "./pop/npcPop/npc-pop.component";
import {TempModule} from '../temp/temp.module';
import {AddPlayerComponent} from '../temp/add-player.component';
import {BoardTransformService} from './services/board-transform.service';
import {BoardVisibilityService} from './services/board-visibility.service';
import {BoardLightService} from './services/board-light.service';
import {BoardTraverseService} from './services/board-traverse.service';


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
        MatSliderModule,
        MatButtonModule,
        TempModule
    ],
    providers: [
        PopService,
        BoardStateService,
        BoardCanvasService,
        BoardWallService,
        BoardTileService,
        BoardTransformService,
        BoardVisibilityService,
        BoardTraverseService,
        BoardLightService
    ],
    entryComponents: [
        NpcPopComponent,
        AddPlayerComponent
    ],
    bootstrap: [],
    exports: [
        BoardZoneComponent
    ]
})
export class BoardModule {
}
