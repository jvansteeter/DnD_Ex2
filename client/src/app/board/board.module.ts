import {BrowserModule} from '@angular/platform-browser';
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatBadgeModule,
    MatMenuModule
} from '@angular/material';
import {NgModule} from '@angular/core';
import {MapRendererComponent} from "./renderer/map-renderer/map-renderer.component";
import {GridRendererComponent} from "./renderer/grid-renderer/grid-renderer.component";
import {HoverRendererComponent} from "./renderer/hover-renderer/hover-renderer.component";
import {LightRendererComponent} from "./renderer/light-renderer/light-renderer.component";
import {WallRendererComponent} from "./renderer/wall-renderer/wall-renderer.component";
import {HighlightRendererComponent} from "./renderer/highlight-renderer/highlight-renderer.component";
import {MouseWheelDirective} from "./mousewheel.directive";
import {BoardControllerComponent} from "./board-control/board-controller.component";
import {FormsModule} from "@angular/forms";
import {BoardStateService} from "./services/board-state.service";
import {BoardCanvasService} from "./services/board-canvas.service";
import {BoardWallService} from "./services/board-wall.service";
import {BoardMapComponent} from './board-map/board-map.component';
import {TokenRendererComponent} from './renderer/token-renderer/token-renderer.component';
import {PopService} from "./pop/pop.service";
import {PopRootComponent} from "./pop/pop-root.component";
import {BoardTransformService} from './services/board-transform.service';
import {BoardVisibilityService} from './services/board-visibility.service';
import {BoardLightService} from './services/board-light.service';
import {BoardTraverseService} from './services/board-traverse.service';
import {VisibilityRendererComponent} from './renderer/visibility-renderer/visibility-renderer.component';
import {BoardPlayerService} from './services/board-player.service';
import {BoardNotationService} from './services/board-notation-service';
import {NotationRendererComponent} from './renderer/notation-renderer/notation-renderer.component';
import {NotationIconSelectorComponent} from "./dialogs/notation-icon-selector/notation-icon-selector.component";
import {NotationColorSelectorComponent} from "./dialogs/notation-color-selector/notation-color-selector.component";
import {NotationSettingsDialogComponent} from "./dialogs/notation-settings-dialog/notation-settings-dialog.component";
import {AddPlayerDialogComponent} from './dialogs/add-player-dialog/add-player-dialog.component';
import {NotationTextEditDialogComponent} from "./dialogs/notation-text-dialog/notation-text-edit-dialog.component";
import {NotationTextCreateDialogComponent} from "./dialogs/notation-text-dialog/notation-text-create-dialog.component";
import {CharacterSheetModule} from '../character-sheet/character-sheet.module';
import {CharacterPopComponent} from './pop/character-pop/character-pop.component';
import {DiagnosticRendererComponent} from "./renderer/diagnostic-renderer/diagnostic-renderer.component";
import {TempPlayerInitDialogComponent} from "./dialogs/temp-player-init-dialog/temp-player-init-dialog.component";
import {ViewEditControlModuleComponent} from "./board-control/controller-modules/view-edit-control-module/view-edit-control-module.component";
import {EncounterConfigControlModuleComponent} from "./board-control/controller-modules/encounter-config-control-module/encounter-config-control-module.component";
import {DiagnosticControlModuleComponent} from "./board-control/controller-modules/diagnostic-control-module/diagnostic-control-module.component";
import {NotationControlModuleComponent} from "./board-control/controller-modules/notation-control-module/notation-control-module.component";
import {LightVisibilityControlModuleComponent} from "./board-control/controller-modules/light-visibility-control-module/light-visibility-control-module.component";
import {TeamSettingsComponent} from './dialogs/team-settings/team-settings.component';
import {LightEditDialogComponent} from "./dialogs/light-edit-dialog/light-edit-dialog.component";
import {BoardTeamsService} from "./services/board-teams.service";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { RendererConsolidationService } from './renderer/renderer-consolidation.service';


@NgModule({
    declarations: [
        PopRootComponent,
        BoardControllerComponent,
        BoardMapComponent,
        MouseWheelDirective,
        MapRendererComponent,
        GridRendererComponent,
        HoverRendererComponent,
        LightRendererComponent,
        WallRendererComponent,
        NotationRendererComponent,
        HighlightRendererComponent,
        TokenRendererComponent,
        VisibilityRendererComponent,
        NotationIconSelectorComponent,
        NotationColorSelectorComponent,
        AddPlayerDialogComponent,
        NotationSettingsDialogComponent,
        NotationTextEditDialogComponent,
        NotationTextCreateDialogComponent,
        LightEditDialogComponent,
        CharacterPopComponent,
        DiagnosticRendererComponent,
        TempPlayerInitDialogComponent,
        ViewEditControlModuleComponent,
        EncounterConfigControlModuleComponent,
        DiagnosticControlModuleComponent,
        NotationControlModuleComponent,
        LightVisibilityControlModuleComponent,
        TeamSettingsComponent,
    ],
    imports: [
        BrowserModule,
        MatRadioModule,
        MatCheckboxModule,
        FormsModule,
        MatSliderModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatDialogModule,
        MatTabsModule,
        MatTableModule,
        MatSortModule,
        MatBadgeModule,
        CharacterSheetModule,
        MatMenuModule,
        DragDropModule,
    ],
    providers: [
        PopService,
        BoardStateService,
        BoardCanvasService,
        BoardWallService,
        BoardTransformService,
        BoardVisibilityService,
        BoardTraverseService,
        BoardLightService,
        BoardPlayerService,
        BoardNotationService,
        BoardTeamsService,
		    RendererConsolidationService,
    ],
    entryComponents: [
        NotationIconSelectorComponent,
        NotationColorSelectorComponent,
        NotationSettingsDialogComponent,
        AddPlayerDialogComponent,
        NotationTextEditDialogComponent,
        NotationTextCreateDialogComponent,
        LightEditDialogComponent,
        CharacterPopComponent,
        TempPlayerInitDialogComponent,
        TeamSettingsComponent,
    ],
    bootstrap: [],
    exports: [
        BoardControllerComponent,
        BoardMapComponent,
        PopRootComponent,
    ]
})
export class BoardModule {
}
