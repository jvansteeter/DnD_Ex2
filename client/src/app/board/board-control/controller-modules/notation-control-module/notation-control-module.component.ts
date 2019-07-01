import {Component} from "@angular/core";
import {NotationIconSelectorComponent} from "../../../dialogs/notation-icon-selector/notation-icon-selector.component";
import {NotationTextCreateDialogComponent} from "../../../dialogs/notation-text-dialog/notation-text-create-dialog.component";
import {NotationMode} from "../../../shared/enum/notation-mode";
import {NotationSettingsDialogComponent} from "../../../dialogs/notation-settings-dialog/notation-settings-dialog.component";
import {NotationColorSelectorComponent} from "../../../dialogs/notation-color-selector/notation-color-selector.component";
import {BoardStateService} from "../../../services/board-state.service";
import {BoardNotationService} from "../../../services/board-notation-service";
import {MatDialog} from "@angular/material";
import {NotationVisibility} from "../../../../../../../shared/types/encounter/board/notation-visibility";
import { EncounterKeyEventService } from "../../../../encounter/encounter-key-event.service";

@Component({
    selector: 'notation-module',
    templateUrl: 'notation-control-module.component.html',
    styleUrls: ['notation-control-module.component.scss']
})

export class NotationControlModuleComponent {
    public NotationMode = NotationMode;
    public NotationVisibility = NotationVisibility;

    constructor(
        private boardStateService: BoardStateService,
        private notationService: BoardNotationService,
        private keyEventService: EncounterKeyEventService,
        private dialog: MatDialog,
    ) {
    }

    handleAddNotation() {
        this.notationService.addNewNotation().subscribe(() => {
            this.boardStateService.isEditingNotation = true;
            this.notationService.activeNotationMode = NotationMode.CELL;
        });
    }

    handleDeleteNotation() {
        this.notationService.deleteActiveNotation();
    }

    handleEditNotation(notationId: string) {
        this.boardStateService.isEditingNotation = true;
        this.notationService.activeNotationId = notationId;
        this.notationService.activeNotationMode = NotationMode.CELL;
    }

    handleFinishNotation() {
        this.boardStateService.isEditingNotation = false;
        this.notationService.activeNotationId = null;
    }

    handleSetNotationModeToCell() {
        this.notationService.activeNotationMode = NotationMode.CELL;
    }

    handleSetNotationModeToPointToPoint() {
        this.notationService.activeNotationMode = NotationMode.POINT_TO_POINT;
    }

    handleSetNotationModeToFreeform() {
        this.notationService.activeNotationMode = NotationMode.FREEFORM;
    }

    handleSetNotationModeToLine() {
        this.notationService.activeNotationMode = NotationMode.LINE;
    }

    openIconDialog() {
        this.dialog.open(NotationIconSelectorComponent,{});
    }

    openColorDialog() {
        this.dialog.open(NotationColorSelectorComponent);
    }

    openSettingDialog() {
        this.dialog.open(NotationSettingsDialogComponent);
    }

    openTextNotationDialog() {
        this.notationService.returnToMeNotationMode = this.notationService.activeNotationMode;
        this.notationService.activeNotationMode = NotationMode.TEXT;
        this.dialog.open(NotationTextCreateDialogComponent);
    }

    stopListeningToKeyEvents(): void {
        this.keyEventService.stopListeningToKeyEvents();
    }

    startListeningToKeyEvents(): void {
        this.keyEventService.startListeningToKeyEvents();
    }

}