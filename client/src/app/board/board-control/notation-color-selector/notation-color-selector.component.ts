import {Component} from "@angular/core";
import {BoardNotationService} from "../../services/board-notation-service";
import {ColorStatics} from "../../statics/color-statics";

@Component({
    selector: 'notation-color-selector',
    templateUrl: 'notation-color-selector.component.html',
    styleUrls: ['notation-color-selector.component.scss']
})

export class NotationColorSelectorComponent {
    selectableColors = [
        'rgba(255, 0, 0, 1.0)',
        'rgba(255, 64, 0, 1.0)',
        'rgba(255, 128, 0, 1.0)',
        'rgba(255, 191, 0, 1.0)',
        'rgba(255, 255, 0, 1.0)',
        'rgba(191, 255, 0, 1.0)',
        'rgba(128, 255, 0, 1.0)',
        'rgba(64, 255, 0, 1.0)',
        'rgba(0, 255, 0, 1.0)',
        'rgba(0, 255, 64, 1.0)',
        'rgba(0, 255, 128, 1.0)',
        'rgba(0, 255, 191, 1.0)',
        'rgba(0, 255, 255, 1.0)',
        'rgba(0, 191, 255, 1.0)',
        'rgba(0, 128, 255, 1.0)',
        'rgba(0, 64, 255, 1.0)',
        'rgba(0, 0, 255, 1.0)',
        'rgba(64, 0, 255, 1.0)',
        'rgba(0, 0, 0, 1.0)',
        'rgba(32, 32, 32, 1.0)',
        'rgba(64, 64, 64, 1.0)',
        'rgba(128, 128, 128, 1.0)',
        'rgba(191, 191, 191, 1.0)',
        'rgba(255, 255, 255, 1.0)',
    ];

    currentColor = 'rgba(255,0,0,0.5)';

    hue = 0.33;
    sat = 1.0;
    lig = 0.5;
    alpha = 0.5;

    constructor(
        public boardNotationService: BoardNotationService
    ) {}

    private colorSelection(inputColor: string) {
        this.boardNotationService.getActiveNotation().setRgbaWithString(inputColor);
        const rgba = ColorStatics.parseRgbaString(inputColor);
        const hsl = ColorStatics.rgbToHsl(rgba[0], rgba[1], rgba[2]);
        this.alpha = rgba[3];
        this.hue = hsl[0];
        this.sat = hsl[1];
        this.lig = hsl[2];
        this.syncColor();
    }

    private handleHueInput(event: any) {
        this.hue = event.value;
        this.syncColor();
    }

    private handleSatInput(event: any) {
        this.sat = event.value;
        this.syncColor();
    }

    private handleLigInput(event: any) {
        this.lig = event.value;
        this.syncColor();
    }

    private handleAlphaInput(event: any) {
        this.alpha = event.value;
        this.syncColor();
    }

    private syncColor() {
        const newColor = ColorStatics.hslToRgb(this.hue, this.sat, this.lig);
        this.currentColor = 'rgba(' + newColor[0] + ',' + newColor[1] + ',' + newColor[2] + ',' + this.alpha + ')';
        this.boardNotationService.getActiveNotation().setRgba(newColor[0], newColor[1], newColor[2], this.alpha);
    }
}