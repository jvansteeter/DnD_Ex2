import {ElementRef, Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {XyPair} from '../geometry/xy-pair';
import {CellTarget} from '../shared/cell-target';
import {CellRegion} from '../shared/enum/cell-region';
import {BoardStateService} from './board-state.service';

@Injectable()
export class BoardCanvasService {

    public canvasNativeElement;
    public cvs_width: number;
    public cvs_height: number;

    constructor(
        private boardStateService: BoardStateService
    ) {
    }

    public updateTransform(ctx: CanvasRenderingContext2D) {
        const scale = this.boardStateService.scale;
        const x_offset = this.boardStateService.x_offset;
        const y_offset = this.boardStateService.y_offset;

        ctx.setTransform(scale, 0, 0, scale, x_offset, y_offset);
    }

    clear_canvas(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(-this.cvs_width, -this.cvs_height, this.cvs_width * 3, this.cvs_height * 3);
    }

    draw_img(ctx: CanvasRenderingContext2D, origin: XyPair, img: HTMLImageElement) {
        // const img = new Image();
        // img.src = img_url;
        ctx.drawImage(img, origin.x, origin.y);
    }

    draw_dot(ctx: CanvasRenderingContext2D, origin: XyPair, rgba_code?: string): void {
        if (isNullOrUndefined(rgba_code)) {
            ctx.fillStyle = 'rgba(50, 50, 50, 1)';
        } else {
            ctx.fillStyle = rgba_code;
        }

        ctx.beginPath();
        ctx.arc(origin.x, origin.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    draw_health_outside(ctx: CanvasRenderingContext2D, cell: XyPair, percent: number) {
        const strokeWidth = 6;
        const health_opacity = 0.5;

        switch(Math.floor((percent * 100) / 15)) {
            case 6: ctx.strokeStyle = 'rgba(0, 166, 81, ' + health_opacity + ')'; break;
            case 5: ctx.strokeStyle = 'rgba(57, 181, 74, ' + health_opacity + ')'; break;
            case 4: ctx.strokeStyle = 'rgba(141, 198, 63, ' + health_opacity + ')'; break;
            case 3: ctx.strokeStyle = 'rgba(255, 242, 0, ' + health_opacity + ')'; break;
            case 2: ctx.strokeStyle = 'rgba(247, 148, 29, ' + health_opacity + ')'; break;
            case 1: ctx.strokeStyle = 'rgba(242, 101, 34, ' + health_opacity + ')'; break;
            case 0: ctx.strokeStyle = 'rgba(237, 28, 36, ' + health_opacity + ')'; break;
        }

        ctx.beginPath();
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.moveTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y + (strokeWidth / 2));

        if (percent <= 0.25) {
            // percent is between 0% - 25%
            ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res * (1.0 - (percent / 0.25)), loc_canvas.y + (strokeWidth / 2));
        } else {
            ctx.lineTo(loc_canvas.x + (strokeWidth / 2), loc_canvas.y + (strokeWidth / 2));

            if (percent <= 0.50) {
                // percent is between 25% - 50%
                ctx.lineTo(loc_canvas.x + (strokeWidth / 2), loc_canvas.y + this.boardStateService.cell_res * ((percent - 0.25) / 0.25));
            } else {
                ctx.lineTo(loc_canvas.x + (strokeWidth / 2), loc_canvas.y + this.boardStateService.cell_res - (strokeWidth / 2));

                if (percent <= 0.75) {
                    // percent is between 50% - 75%
                    ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res * ((percent - 0.5) / 0.25), loc_canvas.y + this.boardStateService.cell_res - (strokeWidth / 2));
                } else {
                    ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res - (strokeWidth / 2), loc_canvas.y + this.boardStateService.cell_res - (strokeWidth / 2));
                    ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res - (strokeWidth / 2), loc_canvas.y + this.boardStateService.cell_res - this.boardStateService.cell_res * ((percent - 0.75) / 0.25));
                }
            }
        }

        ctx.lineWidth = strokeWidth;
        ctx.stroke();
    }

    draw_health_basic(ctx: CanvasRenderingContext2D, cell: XyPair, percent: number) {
        const strokeWidth = 10;
        const health_opacity = 1.0;
        const distanceFromTop = 0.75;   // Top: 0.0 - 1.0 :Bottom

        switch(Math.floor((percent * 100) / 15)) {
            case 6: ctx.strokeStyle = 'rgba(0, 166, 81, ' + health_opacity + ')'; break;
            case 5: ctx.strokeStyle = 'rgba(57, 181, 74, ' + health_opacity + ')'; break;
            case 4: ctx.strokeStyle = 'rgba(141, 198, 63, ' + health_opacity + ')'; break;
            case 3: ctx.strokeStyle = 'rgba(255, 242, 0, ' + health_opacity + ')'; break;
            case 2: ctx.strokeStyle = 'rgba(247, 148, 29, ' + health_opacity + ')'; break;
            case 1: ctx.strokeStyle = 'rgba(242, 101, 34, ' + health_opacity + ')'; break;
            case 0: ctx.strokeStyle = 'rgba(237, 28, 36, ' + health_opacity + ')'; break;
        }

        ctx.beginPath();
        const topLeftCorner = new XyPair(cell.x  * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.moveTo(topLeftCorner.x, topLeftCorner.y + this.boardStateService.cell_res *  distanceFromTop);
        ctx.lineTo(topLeftCorner.x + this.boardStateService.cell_res * percent, topLeftCorner.y + this.boardStateService.cell_res *  distanceFromTop);
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
    }


    draw_line(ctx: CanvasRenderingContext2D, origin: XyPair, target: XyPair, line_width?: number, rgba_code?: string, line_join?: string, line_cap?: string) {
        if (isNullOrUndefined(line_width)) {
            ctx.lineWidth = 5;
        } else {
            ctx.lineWidth = line_width;
        }

        if (isNullOrUndefined(rgba_code)) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        } else {
            ctx.strokeStyle = rgba_code;
        }

        if (isNullOrUndefined(line_join)) {
            ctx.lineJoin = 'round';
        } else {
            ctx.lineJoin = line_join;
        }

        if (isNullOrUndefined(line_cap)) {
            ctx.lineCap = 'round';
        } else {
            ctx.lineCap = line_cap;
        }

        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
    }

    draw_corner(ctx: CanvasRenderingContext2D, xy_loc: XyPair, rgba_code: string, offset: number) {
        const loc = new XyPair(xy_loc.x * this.boardStateService.cell_res, xy_loc.y * this.boardStateService.cell_res);
        const shift = this.boardStateService.cell_res * offset;

        ctx.save();
        ctx.translate(loc.x - shift, loc.y - shift);
        ctx.fillStyle = rgba_code;
        ctx.fillRect(0, 0, 2 * shift, 2 * shift);
        ctx.restore();
    }

    draw_center(ctx: CanvasRenderingContext2D, xy_loc: XyPair, rgba_code: string, offset: number) {
        const loc = new XyPair(xy_loc.x * this.boardStateService.cell_res, xy_loc.y * this.boardStateService.cell_res);
        const shift = this.boardStateService.cell_res * offset;

        ctx.save();
        ctx.translate(loc.x + shift, loc.y + shift);
        ctx.fillStyle = rgba_code;
        ctx.fillRect(0, 0, this.boardStateService.cell_res - (2 * shift), this.boardStateService.cell_res - (2 * shift));
        ctx.restore();
    }

    stroke_center(ctx: CanvasRenderingContext2D, xy_loc: XyPair, rgba_code: string, offset: number) {
        const loc = new XyPair(xy_loc.x * this.boardStateService.cell_res, xy_loc.y * this.boardStateService.cell_res);
        const shift = this.boardStateService.cell_res * offset;

        ctx.save();
        ctx.translate(loc.x + shift, loc.y + shift);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 1;
        ctx.strokeStyle = rgba_code;
        ctx.strokeRect(0, 0, this.boardStateService.cell_res - (2 * shift), this.boardStateService.cell_res - (2 * shift));
        ctx.restore();
    }

    draw_wall(ctx: CanvasRenderingContext2D, target: CellTarget, width: number, rgba_code?: string): void {
        const loc = new XyPair(target.coor.x * this.boardStateService.cell_res, target.coor.y * this.boardStateService.cell_res);

        if (isNullOrUndefined(rgba_code)) {
            ctx.strokeStyle = 'rgba(50, 50, 50, 1)';
        } else {
            ctx.strokeStyle = rgba_code;
        }

        switch (target.zone) {
            case CellRegion.TOP_EDGE:
                this.draw_line(ctx, new XyPair(loc.x, loc.y), new XyPair(loc.x + this.boardStateService.cell_res, loc.y), width, rgba_code);
                break;
            case CellRegion.LEFT_EDGE:
                this.draw_line(ctx, new XyPair(loc.x, loc.y), new XyPair(loc.x, loc.y + this.boardStateService.cell_res), width, rgba_code);
                break;
            case CellRegion.FWRD_EDGE:
                this.draw_line(ctx, new XyPair(loc.x, loc.y + this.boardStateService.cell_res), new XyPair(loc.x + this.boardStateService.cell_res, loc.y), width, rgba_code);
                break;
            case CellRegion.BKWD_EDGE:
                this.draw_line(ctx, new XyPair(loc.x, loc.y), new XyPair(loc.x + this.boardStateService.cell_res, loc.y + this.boardStateService.cell_res), width, rgba_code);
                break;
        }
    }

    /*****************************************************************************************************
     *  Cell CLEAR region functions
     *****************************************************************************************************/

    clear_all(ctx: CanvasRenderingContext2D, xy_pair: XyPair) {
        const loc = new XyPair(xy_pair.x * this.boardStateService.cell_res, xy_pair.y * this.boardStateService.cell_res);

        ctx.save();
        ctx.translate(loc.x, loc.y);
        ctx.clearRect(0, 0, this.boardStateService.cell_res, this.boardStateService.cell_res);
        ctx.restore();
    }

    clear_N(ctx: CanvasRenderingContext2D, cell: XyPair): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);

        ctx.save();

        ctx.beginPath();
        ctx.beginPath();
        ctx.translate(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(this.boardStateService.cell_res, 0);
        ctx.lineTo((this.boardStateService.cell_res / 2), (this.boardStateService.cell_res / 2));
        ctx.lineTo(0, 0);
        ctx.clip();
        ctx.clearRect(0, 0, this.boardStateService.cell_res, this.boardStateService.cell_res);

        ctx.restore();
    }

    clear_E(ctx: CanvasRenderingContext2D, cell: XyPair): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);

        ctx.save();

        ctx.beginPath();
        ctx.translate(loc_canvas.x, loc_canvas.y);
        ctx.moveTo(this.boardStateService.cell_res, 0);
        ctx.lineTo((this.boardStateService.cell_res / 2), (this.boardStateService.cell_res / 2));
        ctx.lineTo(this.boardStateService.cell_res, this.boardStateService.cell_res);
        ctx.lineTo(this.boardStateService.cell_res, 0);
        ctx.clip();
        ctx.clearRect(0, 0, this.boardStateService.cell_res, this.boardStateService.cell_res);

        ctx.restore();
    }

    clear_S(ctx: CanvasRenderingContext2D, cell: XyPair): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.save();

        ctx.beginPath();
        ctx.translate(loc_canvas.x, loc_canvas.y);
        ctx.moveTo(this.boardStateService.cell_res, this.boardStateService.cell_res);
        ctx.lineTo((this.boardStateService.cell_res / 2), (this.boardStateService.cell_res / 2));
        ctx.lineTo(0, this.boardStateService.cell_res);
        ctx.lineTo(this.boardStateService.cell_res, this.boardStateService.cell_res);
        ctx.clip();
        ctx.clearRect(0, 0, this.boardStateService.cell_res, this.boardStateService.cell_res);

        ctx.restore();
    }

    clear_W(ctx: CanvasRenderingContext2D, cell: XyPair): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);

        ctx.save();

        ctx.beginPath();
        ctx.translate(loc_canvas.x, loc_canvas.y);
        ctx.moveTo(0, this.boardStateService.cell_res);
        ctx.lineTo((this.boardStateService.cell_res / 2), (this.boardStateService.cell_res / 2));
        ctx.lineTo(0, 0);
        ctx.lineTo(0, this.boardStateService.cell_res);
        ctx.clip();
        ctx.clearRect(0, 0, this.boardStateService.cell_res, this.boardStateService.cell_res);

        ctx.restore();
    }

    /*****************************************************************************************************
     *  Cell FILL region functions
     *****************************************************************************************************/

    draw_fill_all(ctx: CanvasRenderingContext2D, xy_pair: XyPair, fill_code: string | CanvasGradient | CanvasPattern) {
        const loc = new XyPair(xy_pair.x * this.boardStateService.cell_res, xy_pair.y * this.boardStateService.cell_res);

        ctx.save();
        ctx.fillStyle = fill_code;
        ctx.translate(loc.x, loc.y);
        ctx.fillRect(0, 0, this.boardStateService.cell_res, this.boardStateService.cell_res);
        ctx.restore();
    }

    draw_fill_N(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.save();
        ctx.beginPath();

        ctx.translate(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(this.boardStateService.cell_res, 0);
        ctx.lineTo((this.boardStateService.cell_res / 2), (this.boardStateService.cell_res / 2));
        ctx.lineTo(0, 0);

        ctx.fill();
        ctx.restore();
    }

    draw_fill_E(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.save();
        ctx.beginPath();

        ctx.translate(loc_canvas.x, loc_canvas.y);

        ctx.moveTo(this.boardStateService.cell_res, 0);
        ctx.lineTo((this.boardStateService.cell_res / 2), (this.boardStateService.cell_res / 2));
        ctx.lineTo(this.boardStateService.cell_res, this.boardStateService.cell_res);
        ctx.lineTo(this.boardStateService.cell_res, 0);

        ctx.fill();
        ctx.restore();
    }

    draw_fill_S(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.save();
        ctx.beginPath();

        ctx.translate(loc_canvas.x, loc_canvas.y);

        ctx.moveTo(this.boardStateService.cell_res, this.boardStateService.cell_res);
        ctx.lineTo((this.boardStateService.cell_res / 2), (this.boardStateService.cell_res / 2));
        ctx.lineTo(0, this.boardStateService.cell_res);
        ctx.lineTo(this.boardStateService.cell_res, this.boardStateService.cell_res);

        ctx.fill();
        ctx.restore();
    }

    draw_fill_W(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.save();
        ctx.beginPath();

        ctx.translate(loc_canvas.x, loc_canvas.y);

        ctx.moveTo(0, this.boardStateService.cell_res);
        ctx.lineTo((this.boardStateService.cell_res / 2), (this.boardStateService.cell_res / 2));
        ctx.lineTo(0, 0);
        ctx.lineTo(0, this.boardStateService.cell_res);

        ctx.fill();
        ctx.restore();
    }

    draw_fill_NE(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x, loc_canvas.y);
        ctx.fill();
    }

    draw_fill_SE(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y);
        ctx.fill();
    }

    draw_fill_NW(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y);
        ctx.fill();
    }

    draw_fill_SW(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y);
        ctx.fill();
    }

    draw_fill_NES(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x + (this.boardStateService.cell_res / 2), loc_canvas.y + (this.boardStateService.cell_res / 2));
        ctx.lineTo(loc_canvas.x, loc_canvas.y);

        ctx.fill();
    }

    draw_fill_ESW(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + (this.boardStateService.cell_res / 2), loc_canvas.y + (this.boardStateService.cell_res / 2));
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y);
        ctx.fill();
    }

    draw_fill_SWN(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + (this.boardStateService.cell_res / 2), loc_canvas.y + (this.boardStateService.cell_res / 2));
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y);
        ctx.fill();
    }

    draw_fill_WNE(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * this.boardStateService.cell_res, cell.y * this.boardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + this.boardStateService.cell_res, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x + (this.boardStateService.cell_res / 2), loc_canvas.y + (this.boardStateService.cell_res / 2));
        ctx.lineTo(loc_canvas.x, loc_canvas.y + this.boardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y);
        ctx.fill();
    }
}
