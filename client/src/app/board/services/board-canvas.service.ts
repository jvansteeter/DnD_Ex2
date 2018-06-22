import {ElementRef, Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {XyPair} from '../geometry/xy-pair';
import {CellTarget} from '../shared/cell-target';
import {CellRegion} from '../shared/enum/cell-region';
import {BoardStateService} from './board-state.service';
import {CellTargetStatics} from './cell-target-statics';
import {start} from 'repl';

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
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.moveTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y + (strokeWidth / 2));

        if (percent <= 0.25) {
            // percent is between 0% - 25%
            ctx.lineTo(loc_canvas.x + BoardStateService.cell_res * (1.0 - (percent / 0.25)), loc_canvas.y + (strokeWidth / 2));
        } else {
            ctx.lineTo(loc_canvas.x + (strokeWidth / 2), loc_canvas.y + (strokeWidth / 2));

            if (percent <= 0.50) {
                // percent is between 25% - 50%
                ctx.lineTo(loc_canvas.x + (strokeWidth / 2), loc_canvas.y + BoardStateService.cell_res * ((percent - 0.25) / 0.25));
            } else {
                ctx.lineTo(loc_canvas.x + (strokeWidth / 2), loc_canvas.y + BoardStateService.cell_res - (strokeWidth / 2));

                if (percent <= 0.75) {
                    // percent is between 50% - 75%
                    ctx.lineTo(loc_canvas.x + BoardStateService.cell_res * ((percent - 0.5) / 0.25), loc_canvas.y + BoardStateService.cell_res - (strokeWidth / 2));
                } else {
                    ctx.lineTo(loc_canvas.x + BoardStateService.cell_res - (strokeWidth / 2), loc_canvas.y + BoardStateService.cell_res - (strokeWidth / 2));
                    ctx.lineTo(loc_canvas.x + BoardStateService.cell_res - (strokeWidth / 2), loc_canvas.y + BoardStateService.cell_res - BoardStateService.cell_res * ((percent - 0.75) / 0.25));
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
        const topLeftCorner = new XyPair(cell.x  * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.moveTo(topLeftCorner.x, topLeftCorner.y + BoardStateService.cell_res *  distanceFromTop);
        ctx.lineTo(topLeftCorner.x + BoardStateService.cell_res * percent, topLeftCorner.y + BoardStateService.cell_res *  distanceFromTop);
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
        const loc = new XyPair(xy_loc.x * BoardStateService.cell_res, xy_loc.y * BoardStateService.cell_res);
        const shift = BoardStateService.cell_res * offset;

        ctx.save();
        ctx.translate(loc.x - shift, loc.y - shift);
        ctx.fillStyle = rgba_code;
        ctx.fillRect(0, 0, 2 * shift, 2 * shift);
        ctx.restore();
    }

    draw_center(ctx: CanvasRenderingContext2D, xy_loc: XyPair, rgba_code: string, offset: number) {
        const loc = new XyPair(xy_loc.x * BoardStateService.cell_res, xy_loc.y * BoardStateService.cell_res);
        const shift = BoardStateService.cell_res * offset;

        ctx.save();
        ctx.translate(loc.x + shift, loc.y + shift);
        ctx.fillStyle = rgba_code;
        ctx.fillRect(0, 0, BoardStateService.cell_res - (2 * shift), BoardStateService.cell_res - (2 * shift));
        ctx.restore();
    }

    stroke_center(ctx: CanvasRenderingContext2D, xy_loc: XyPair, rgba_code: string, offset: number) {
        const loc = new XyPair(xy_loc.x * BoardStateService.cell_res, xy_loc.y * BoardStateService.cell_res);
        const shift = BoardStateService.cell_res * offset;

        ctx.save();
        ctx.translate(loc.x + shift, loc.y + shift);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 1;
        ctx.strokeStyle = rgba_code;
        ctx.strokeRect(0, 0, BoardStateService.cell_res - (2 * shift), BoardStateService.cell_res - (2 * shift));
        ctx.restore();
    }

    draw_wall(ctx: CanvasRenderingContext2D, target: CellTarget, width: number, rgba_code?: string): void {
        const loc = new XyPair(target.location.x * BoardStateService.cell_res, target.location.y * BoardStateService.cell_res);

        if (isNullOrUndefined(rgba_code)) {
            ctx.strokeStyle = 'rgba(50, 50, 50, 1)';
        } else {
            ctx.strokeStyle = rgba_code;
        }

        switch (target.region) {
            case CellRegion.TOP_EDGE:
                this.draw_line(ctx, new XyPair(loc.x, loc.y), new XyPair(loc.x + BoardStateService.cell_res, loc.y), width, rgba_code);
                break;
            case CellRegion.LEFT_EDGE:
                this.draw_line(ctx, new XyPair(loc.x, loc.y), new XyPair(loc.x, loc.y + BoardStateService.cell_res), width, rgba_code);
                break;
            case CellRegion.FWRD_EDGE:
                this.draw_line(ctx, new XyPair(loc.x, loc.y + BoardStateService.cell_res), new XyPair(loc.x + BoardStateService.cell_res, loc.y), width, rgba_code);
                break;
            case CellRegion.BKWD_EDGE:
                this.draw_line(ctx, new XyPair(loc.x, loc.y), new XyPair(loc.x + BoardStateService.cell_res, loc.y + BoardStateService.cell_res), width, rgba_code);
                break;
        }
    }

    stroke_polygon(ctx: CanvasRenderingContext2D, cell_target_points: Array<CellTarget>, stroke_code: string | CanvasGradient | CanvasPattern) {
        ctx.strokeStyle = stroke_code;
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        let process_point;
        let index;
        for (index = 0; index < cell_target_points.length; index++) {
            process_point = CellTargetStatics.getPointCanvasCoor(cell_target_points[index]);
            ctx.lineTo(process_point.x, process_point.y);
        }
        process_point = CellTargetStatics.getPointCanvasCoor(cell_target_points[0]);
        ctx.lineTo(process_point.x, process_point.y);
        ctx.stroke();
    }

    /*****************************************************************************************************
     *  Cell CLEAR region functions
     *****************************************************************************************************/

    clear_all(ctx: CanvasRenderingContext2D, xy_pair: XyPair) {
        const loc = new XyPair(xy_pair.x * BoardStateService.cell_res, xy_pair.y * BoardStateService.cell_res);

        ctx.save();
        ctx.translate(loc.x, loc.y);
        ctx.clearRect(0, 0, BoardStateService.cell_res, BoardStateService.cell_res);
        ctx.restore();
    }

    clear_quad(ctx: CanvasRenderingContext2D, target: CellTarget) {
        if (target.region === CellRegion.TOP_QUAD) {
            this.clear_N(ctx, target.location);
        }
        if (target.region === CellRegion.RIGHT_QUAD) {
            this.clear_E(ctx, target.location);
        }
        if (target.region === CellRegion.BOTTOM_QUAD) {
            this.clear_S(ctx, target.location);
        }
        if (target.region === CellRegion.LEFT_QUAD) {
            this.clear_W(ctx, target.location);
        }
    }

    clear_N(ctx: CanvasRenderingContext2D, cell: XyPair): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);

        ctx.save();

        ctx.beginPath();
        ctx.beginPath();
        ctx.translate(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(BoardStateService.cell_res, 0);
        ctx.lineTo((BoardStateService.cell_res / 2), (BoardStateService.cell_res / 2));
        ctx.lineTo(0, 0);
        ctx.clip();
        ctx.clearRect(0, 0, BoardStateService.cell_res, BoardStateService.cell_res);

        ctx.restore();
    }

    clear_E(ctx: CanvasRenderingContext2D, cell: XyPair): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);

        ctx.save();

        ctx.beginPath();
        ctx.translate(loc_canvas.x, loc_canvas.y);
        ctx.moveTo(BoardStateService.cell_res, 0);
        ctx.lineTo((BoardStateService.cell_res / 2), (BoardStateService.cell_res / 2));
        ctx.lineTo(BoardStateService.cell_res, BoardStateService.cell_res);
        ctx.lineTo(BoardStateService.cell_res, 0);
        ctx.clip();
        ctx.clearRect(0, 0, BoardStateService.cell_res, BoardStateService.cell_res);

        ctx.restore();
    }

    clear_S(ctx: CanvasRenderingContext2D, cell: XyPair): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.save();

        ctx.beginPath();
        ctx.translate(loc_canvas.x, loc_canvas.y);
        ctx.moveTo(BoardStateService.cell_res, BoardStateService.cell_res);
        ctx.lineTo((BoardStateService.cell_res / 2), (BoardStateService.cell_res / 2));
        ctx.lineTo(0, BoardStateService.cell_res);
        ctx.lineTo(BoardStateService.cell_res, BoardStateService.cell_res);
        ctx.clip();
        ctx.clearRect(0, 0, BoardStateService.cell_res, BoardStateService.cell_res);

        ctx.restore();
    }

    clear_W(ctx: CanvasRenderingContext2D, cell: XyPair): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);

        ctx.save();

        ctx.beginPath();
        ctx.translate(loc_canvas.x, loc_canvas.y);
        ctx.moveTo(0, BoardStateService.cell_res);
        ctx.lineTo((BoardStateService.cell_res / 2), (BoardStateService.cell_res / 2));
        ctx.lineTo(0, 0);
        ctx.lineTo(0, BoardStateService.cell_res);
        ctx.clip();
        ctx.clearRect(0, 0, BoardStateService.cell_res, BoardStateService.cell_res);

        ctx.restore();
    }

    clear_polygon(ctx: CanvasRenderingContext2D, points: Array<CellTarget>) {
        ctx.save();

        ctx.beginPath();
        let process_point;
        let index;
        for (index = 0; index < points.length; index++) {
            process_point = CellTargetStatics.getPointCanvasCoor(points[index]);
            ctx.lineTo(process_point.x, process_point.y);
        }
        process_point = CellTargetStatics.getPointCanvasCoor(points[0]);
        ctx.lineTo(process_point.x, process_point.y);
        ctx.clip();
        this.clear_canvas(ctx);
        ctx.restore();
    }

    /*****************************************************************************************************
     *  Cell FILL region functions
     *****************************************************************************************************/

    draw_fill_polygon(ctx: CanvasRenderingContext2D, points: Array<CellTarget>, fill_code: string | CanvasGradient | CanvasPattern) {
        ctx.save();

        ctx.fillStyle = fill_code;

        ctx.beginPath();
        let process_point;
        let index;
        for (index = 0; index < points.length; index++) {
            process_point = CellTargetStatics.getPointCanvasCoor(points[index]);
            ctx.lineTo(process_point.x, process_point.y);
        }
        process_point = CellTargetStatics.getPointCanvasCoor(points[0]);
        ctx.lineTo(process_point.x, process_point.y);
        ctx.fill();
        ctx.restore();
    }

    draw_fill_quad(ctx: CanvasRenderingContext2D, target: CellTarget, fill_code: string | CanvasGradient | CanvasPattern) {
        if (target.region === CellRegion.TOP_QUAD) {
            this.draw_fill_N(ctx, target.location, fill_code);
        }
        if (target.region === CellRegion.RIGHT_QUAD) {
            this.draw_fill_E(ctx, target.location, fill_code);
        }
        if (target.region === CellRegion.BOTTOM_QUAD) {
            this.draw_fill_S(ctx, target.location, fill_code);
        }
        if (target.region === CellRegion.LEFT_QUAD) {
            this.draw_fill_W(ctx, target.location, fill_code);
        }
    }

    draw_fill_all(ctx: CanvasRenderingContext2D, xy_pair: XyPair, fill_code: string | CanvasGradient | CanvasPattern) {
        const loc = new XyPair(xy_pair.x * BoardStateService.cell_res, xy_pair.y * BoardStateService.cell_res);

        ctx.save();
        ctx.fillStyle = fill_code;
        ctx.translate(loc.x, loc.y);
        ctx.fillRect(0, 0, BoardStateService.cell_res, BoardStateService.cell_res);
        ctx.restore();
    }

    draw_fill_N(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.save();
        ctx.beginPath();

        ctx.translate(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(BoardStateService.cell_res, 0);
        ctx.lineTo((BoardStateService.cell_res / 2), (BoardStateService.cell_res / 2));
        ctx.lineTo(0, 0);

        ctx.fill();
        ctx.restore();
    }

    draw_fill_E(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.save();
        ctx.beginPath();

        ctx.translate(loc_canvas.x, loc_canvas.y);

        ctx.moveTo(BoardStateService.cell_res, 0);
        ctx.lineTo((BoardStateService.cell_res / 2), (BoardStateService.cell_res / 2));
        ctx.lineTo(BoardStateService.cell_res, BoardStateService.cell_res);
        ctx.lineTo(BoardStateService.cell_res, 0);

        ctx.fill();
        ctx.restore();
    }

    draw_fill_S(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.save();
        ctx.beginPath();

        ctx.translate(loc_canvas.x, loc_canvas.y);

        ctx.moveTo(BoardStateService.cell_res, BoardStateService.cell_res);
        ctx.lineTo((BoardStateService.cell_res / 2), (BoardStateService.cell_res / 2));
        ctx.lineTo(0, BoardStateService.cell_res);
        ctx.lineTo(BoardStateService.cell_res, BoardStateService.cell_res);

        ctx.fill();
        ctx.restore();
    }

    draw_fill_W(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.save();
        ctx.beginPath();

        ctx.translate(loc_canvas.x, loc_canvas.y);

        ctx.moveTo(0, BoardStateService.cell_res);
        ctx.lineTo((BoardStateService.cell_res / 2), (BoardStateService.cell_res / 2));
        ctx.lineTo(0, 0);
        ctx.lineTo(0, BoardStateService.cell_res);

        ctx.fill();
        ctx.restore();
    }

    draw_fill_NE(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x, loc_canvas.y);
        ctx.fill();
    }

    draw_fill_SE(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y);
        ctx.fill();
    }

    draw_fill_NW(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y);
        ctx.fill();
    }

    draw_fill_SW(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y);
        ctx.fill();
    }

    draw_fill_NES(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x + (BoardStateService.cell_res / 2), loc_canvas.y + (BoardStateService.cell_res / 2));
        ctx.lineTo(loc_canvas.x, loc_canvas.y);

        ctx.fill();
    }

    draw_fill_ESW(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + (BoardStateService.cell_res / 2), loc_canvas.y + (BoardStateService.cell_res / 2));
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y);
        ctx.fill();
    }

    draw_fill_SWN(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + (BoardStateService.cell_res / 2), loc_canvas.y + (BoardStateService.cell_res / 2));
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y);
        ctx.fill();
    }

    draw_fill_WNE(ctx: CanvasRenderingContext2D, cell: XyPair, fill_code: string | CanvasGradient | CanvasPattern): void {
        const loc_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.fillStyle = fill_code;

        ctx.beginPath();
        ctx.moveTo(loc_canvas.x, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y);
        ctx.lineTo(loc_canvas.x + BoardStateService.cell_res, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x + (BoardStateService.cell_res / 2), loc_canvas.y + (BoardStateService.cell_res / 2));
        ctx.lineTo(loc_canvas.x, loc_canvas.y + BoardStateService.cell_res);
        ctx.lineTo(loc_canvas.x, loc_canvas.y);
        ctx.fill();
    }
}
