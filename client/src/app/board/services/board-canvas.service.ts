import {Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import {CellTarget} from '../shared/cell-target';
import {CellRegion} from '../shared/enum/cell-region';
import {BoardStateService} from './board-state.service';
import {CellTargetStatics} from '../statics/cell-target-statics';
import {IsReadyService} from "../../utilities/services/isReady.service";

@Injectable()
export class BoardCanvasService extends IsReadyService {
    public mapContainerNativeElement;

    constructor(
        private boardStateService: BoardStateService
    ) {
        super(boardStateService);
    }

    public init(): void {
        this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady && !this.isReady()) {
                console.log('boardCanvasService.init -> isReady');
            	  if (this.dependenciesSub) {
		              this.dependenciesSub.unsubscribe();
	              }
                this.setReady(true);
            }
        })
    }

    public unInit(): void {
        console.log('boardCanvasService: unInit()');
        this.setReady(false);
    }

    public updateTransform(ctx: CanvasRenderingContext2D) {
        const scale = this.boardStateService.canvasTransform_scale;
        const x_offset = this.boardStateService.canvasTransform_xOffset;
        const y_offset = this.boardStateService.canvasTransform_yOffset;

        ctx.setTransform(scale, 0, 0, scale, x_offset, y_offset);
    }

    clear_canvas(ctx: CanvasRenderingContext2D) {
        const visible_pix_x = (this.boardStateService.canvasElement_width / this.boardStateService.canvasTransform_scale) + 100;
        const visible_pix_y = (this.boardStateService.canvasElement_height / this.boardStateService.canvasTransform_scale) + 100;
        const scaled_offset_x = (-this.boardStateService.canvasTransform_xOffset / this.boardStateService.canvasTransform_scale) - 50;
        const scaled_offset_y = (-this.boardStateService.canvasTransform_yOffset / this.boardStateService.canvasTransform_scale) - 50;

        ctx.clearRect(scaled_offset_x, scaled_offset_y, visible_pix_x, visible_pix_y);

    }

    public trim_canvas(ctx: CanvasRenderingContext2D) {
        ctx.globalCompositeOperation = 'destination-in';
        ctx.fillStyle = 'rgba(255,0,0,1)';
        ctx.fillRect(0,0,BoardStateService.map_res_x, BoardStateService.map_res_y);
        ctx.globalCompositeOperation = 'source-over';
    }

    draw_img(ctx: CanvasRenderingContext2D, origin: XyPair, img: HTMLImageElement, opacity: number = 1.0) {
        ctx.globalAlpha = opacity;
        ctx.drawImage(img, origin.x, origin.y);
        ctx.globalAlpha = 1.0;
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

    draw_text(ctx: CanvasRenderingContext2D, anchor: XyPair, text: string, fontSize = 30, rgbaCode: string) {
        ctx.font = fontSize + 'px Arial';
        ctx.fillStyle = rgbaCode;
        ctx.fillText(text, anchor.x, anchor.y);
    }

    draw_health_outside(ctx: CanvasRenderingContext2D, cell: XyPair, percent: number) {
        const strokeWidth = 6;
        const health_opacity = 0.5;

        switch (Math.floor((percent * 100) / 15)) {
            case 6:
                ctx.strokeStyle = 'rgba(0, 166, 81, ' + health_opacity + ')';
                break;
            case 5:
                ctx.strokeStyle = 'rgba(57, 181, 74, ' + health_opacity + ')';
                break;
            case 4:
                ctx.strokeStyle = 'rgba(141, 198, 63, ' + health_opacity + ')';
                break;
            case 3:
                ctx.strokeStyle = 'rgba(255, 242, 0, ' + health_opacity + ')';
                break;
            case 2:
                ctx.strokeStyle = 'rgba(247, 148, 29, ' + health_opacity + ')';
                break;
            case 1:
                ctx.strokeStyle = 'rgba(242, 101, 34, ' + health_opacity + ')';
                break;
            case 0:
                ctx.strokeStyle = 'rgba(237, 28, 36, ' + health_opacity + ')';
                break;
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

    draw_grid(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';

        let cell_res = BoardStateService.cell_res;
        let cur_x = 0;
        let cur_y = cell_res;

        ctx.beginPath();
        ctx.moveTo(cur_x, cur_y);

        while (cur_y <= this.boardStateService.mapDimY * BoardStateService.cell_res) {
            let movingRight = true;
            let movingUp = true;

            while (movingRight) {
                // horizontal action
                ctx.lineTo(cur_x + cell_res, cur_y);
                cur_x += cell_res;

                // check for enc
                if (cur_x === this.boardStateService.mapDimX * BoardStateService.cell_res) {
                    movingRight = false;
                    ctx.lineTo(cur_x, cur_y + cell_res);
                    cur_y += cell_res;
                    break;
                }

                // vertical action
                if (movingUp) {
                    ctx.lineTo(cur_x, cur_y - cell_res);
                    cur_y -= cell_res;
                    movingUp = !movingUp;

                } else {
                    ctx.lineTo(cur_x, cur_y + cell_res);
                    cur_y += cell_res;
                    movingUp = !movingUp;
                }
            }

            while (!movingRight) {
                // horizontal action
                ctx.lineTo(cur_x - cell_res, cur_y);
                cur_x -= cell_res;

                // check for enc
                if (cur_x === 0) {
                    movingRight = true;
                    ctx.lineTo(cur_x, cur_y - cell_res);
                    cur_y -= cell_res;

                    ctx.lineTo(cur_x, cur_y + 2 * cell_res);
                    cur_y += 2 * cell_res;
                    break;
                }

                // vertical action
                if (movingUp) {
                    ctx.lineTo(cur_x, cur_y - cell_res);
                    cur_y -= cell_res;
                    movingUp = !movingUp;

                } else {
                    ctx.lineTo(cur_x, cur_y + cell_res);
                    cur_y += cell_res;
                    movingUp = !movingUp;
                }
            }
        }
        ctx.fill();
        this.trim_canvas(ctx);
    }

    draw_health_basic(ctx: CanvasRenderingContext2D, cell: XyPair, percent: number) {
        const strokeWidth = 10;
        const health_opacity = 1.0;
        const distanceFromTop = 0.75;   // Top: 0.0 - 1.0 :Bottom

        switch (Math.floor((percent * 100) / 15)) {
            case 6:
                ctx.strokeStyle = 'rgba(0, 166, 81, ' + health_opacity + ')';
                break;
            case 5:
                ctx.strokeStyle = 'rgba(57, 181, 74, ' + health_opacity + ')';
                break;
            case 4:
                ctx.strokeStyle = 'rgba(141, 198, 63, ' + health_opacity + ')';
                break;
            case 3:
                ctx.strokeStyle = 'rgba(255, 242, 0, ' + health_opacity + ')';
                break;
            case 2:
                ctx.strokeStyle = 'rgba(247, 148, 29, ' + health_opacity + ')';
                break;
            case 1:
                ctx.strokeStyle = 'rgba(242, 101, 34, ' + health_opacity + ')';
                break;
            case 0:
                ctx.strokeStyle = 'rgba(237, 28, 36, ' + health_opacity + ')';
                break;
        }

        ctx.beginPath();
        const topLeftCorner = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.moveTo(topLeftCorner.x, topLeftCorner.y + BoardStateService.cell_res * distanceFromTop);
        ctx.lineTo(topLeftCorner.x + BoardStateService.cell_res * percent, topLeftCorner.y + BoardStateService.cell_res * distanceFromTop);
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
    }

    public draw_pixel(ctx: CanvasRenderingContext2D, point: XyPair, rgbaCode) {
        ctx.fillStyle = rgbaCode;
        ctx.fillRect(point.x, point.y, 1, 1);
    }

    public fill_canvas(ctx: CanvasRenderingContext2D, rgbaCode) {
        ctx.fillStyle = rgbaCode;
        ctx.fillRect(0, 0, this.boardStateService.mapDimX * BoardStateService.cell_res, this.boardStateService.mapDimY * BoardStateService.cell_res);
    }

    draw_polyline(ctx: CanvasRenderingContext2D, points: Array<XyPair>, strokeStyle: string, width = 2) {
        ctx.lineWidth = width;
        ctx.strokeStyle = strokeStyle;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        for (let point of points) {
            ctx.lineTo(point.x, point.y);
        }
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

    draw_window(ctx: CanvasRenderingContext2D, target: CellTarget, isTransparent:boolean = true, isBlocking:boolean = true) {
        const loc = new XyPair(target.location.x * BoardStateService.cell_res, target.location.y * BoardStateService.cell_res);

        ctx.strokeStyle = 'rgba(50, 50, 50, 1)';
        if (isTransparent) {
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        } else {
            ctx.fillStyle = 'rgba(120, 120, 120, 1)';
        }
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;

        if (isBlocking) {
            ctx.setLineDash([]);
        } else {
            ctx.setLineDash([1,4]);
        }

        const window_depth = 3;
        const window_width_percent = 0.65;
        const window_width_px = BoardStateService.cell_res * window_width_percent;
        const window_width_offset = BoardStateService.cell_res * (1 - window_width_percent) / 2;

        let x;
        let y;

        switch (target.region) {
            case CellRegion.TOP_EDGE:
                ctx.beginPath();

                x = loc.x + window_width_offset;
                y = loc.y - window_depth;

                ctx.lineTo(x, y);
                ctx.lineTo(x + window_width_px, y);
                ctx.lineTo(x + window_width_px, y + (2 * window_depth));
                ctx.lineTo(x, y + (2 * window_depth));
                ctx.lineTo(x, y);

                ctx.fill();
                ctx.stroke();
                break;
            case CellRegion.LEFT_EDGE:
                ctx.beginPath();

                x = loc.x - window_depth;
                y = loc.y + window_width_offset;

                ctx.lineTo(x, y);
                ctx.lineTo(x, y + window_width_px);
                ctx.lineTo(x + (2 * window_depth), y + window_width_px);
                ctx.lineTo(x + (2 * window_depth), y);
                ctx.lineTo(x, y);

                ctx.fill();
                ctx.stroke();
                break;
            case CellRegion.FWRD_EDGE:
                ctx.beginPath();

                x = loc.x;
                y = loc.y;

                ctx.lineTo(x, y);
                ctx.lineTo(x, y);
                ctx.lineTo(x, y);
                ctx.lineTo(x, y);
                ctx.lineTo(x, y);

                ctx.fill();
                ctx.stroke();
                break;
            case CellRegion.BKWD_EDGE:
                ctx.beginPath();


                ctx.fill();
                ctx.stroke();
                break;
        }
        ctx.setLineDash([]);
    }

    draw_door(ctx: CanvasRenderingContext2D, target: CellTarget, isOpen = false) {
        const loc = new XyPair(target.location.x * BoardStateService.cell_res, target.location.y * BoardStateService.cell_res);

        ctx.strokeStyle = 'rgba(50, 50, 50, 1)';
        if (isOpen) {
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        } else {
            ctx.fillStyle = 'rgba(120, 120, 120, 1)';
        }
        ctx.lineWidth = 3;
        const radius = 7;

        let x;
        let y;

        switch (target.region) {
            case CellRegion.TOP_EDGE:
                ctx.beginPath();
                ctx.arc(loc.x + radius, loc.y, radius, 0.5 * Math.PI, 1.5 * Math.PI);
                ctx.lineTo(loc.x + BoardStateService.cell_res - radius, loc.y - radius);
                ctx.arc(loc.x + BoardStateService.cell_res - radius, loc.y, radius, 1.5 * Math.PI, 0.5 * Math.PI);
                ctx.lineTo(loc.x + radius, loc.y + radius);
                ctx.fill();
                ctx.stroke();
                break;
            case CellRegion.LEFT_EDGE:
                ctx.beginPath();
                ctx.arc(loc.x, loc.y + radius, radius, Math.PI, 0);
                ctx.lineTo(loc.x + radius, loc.y + BoardStateService.cell_res - radius);
                ctx.arc(loc.x, loc.y + BoardStateService.cell_res - radius, radius, 0, Math.PI);
                ctx.lineTo(loc.x - radius, loc.y + radius);
                ctx.fill();
                ctx.stroke();
                break;
            case CellRegion.FWRD_EDGE:
                ctx.beginPath();
                x = loc.x + radius;
                y = loc.y + BoardStateService.cell_res - radius;
                ctx.arc(x, y, radius, 0.25 * Math.PI, 1.25 * Math.PI);

                x = loc.x + BoardStateService.cell_res - radius;
                y = loc.y + radius;
                ctx.lineTo(x + radius * Math.cos(1.25 * Math.PI), y + radius * Math.sin(1.25 * Math.PI));
                ctx.arc(x, y, radius, 1.25 * Math.PI, 0.25 * Math.PI);

                x = loc.x + radius;
                y = loc.y + BoardStateService.cell_res - radius;
                ctx.lineTo(x + radius * Math.cos(0.25 * Math.PI), y + radius * Math.sin(0.25 * Math.PI));
                ctx.fill();
                ctx.stroke();
                break;
            case CellRegion.BKWD_EDGE:
                ctx.beginPath();
                x = loc.x + radius;
                y = loc.y + radius;
                ctx.arc(x, y, radius, 0.75 * Math.PI, 1.75 * Math.PI);

                x = loc.x + BoardStateService.cell_res - radius;
                y = loc.y + BoardStateService.cell_res - radius;
                ctx.lineTo(x + radius * Math.cos(1.75 * Math.PI), y + radius * Math.sin(1.75 * Math.PI));
                ctx.arc(x, y, radius, 1.75 * Math.PI, 0.75 * Math.PI);

                x = loc.x + radius;
                y = loc.y + radius;
                ctx.lineTo(x + radius * Math.cos(0.75 * Math.PI), y + radius * Math.sin(0.75 * Math.PI));
                ctx.fill();
                ctx.stroke();
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

    stroke_point_array(ctx: CanvasRenderingContext2D, points: Array<XyPair>, rgbaCode: string, lineWidth = 1) {
        if (points.length === 0) {
            return;
        }

        ctx.strokeStyle = rgbaCode;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        let process_point;
        let index;

        for (let point of points) {
            ctx.lineTo(point.x, point.y);
        }

        ctx.lineTo(points[0].x, points[0].y);
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

    clear_xy_array(ctx: CanvasRenderingContext2D, xyArray: Array<XyPair>) {
        if (isNullOrUndefined(xyArray)){
            return;
        }

        ctx.save();

        ctx.beginPath();
        for (let point of xyArray) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.lineTo(xyArray[0].x, xyArray[0].y);

        ctx.clip();
        this.clear_canvas(ctx);
        ctx.restore();
    }

    /*****************************************************************************************************
     *  Cell FILL region functions
     *****************************************************************************************************/
    fill_xy_array(ctx: CanvasRenderingContext2D, xyArray: Array<XyPair>, rgbaCode: string) {
        if (isNullOrUndefined(xyArray)){
            return;
        }

        ctx.save();

        ctx.fillStyle = rgbaCode;

        ctx.beginPath();
        for (let point of xyArray) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.lineTo(xyArray[0].x, xyArray[0].y);
        ctx.fill();
        ctx.restore()
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

    /*****************************************************************************************************
     *  Direction pointers
     *****************************************************************************************************/
    draw_pointer_N(ctx: CanvasRenderingContext2D, cell:XyPair, rgba_code: string) {
        const cell_center_canvas = new XyPair(cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
        const target_canvas = new XyPair(cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, cell.y * BoardStateService.cell_res);
        ctx.strokeStyle = rgba_code;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cell_center_canvas.x, cell_center_canvas.y);
        ctx.lineTo(target_canvas.x, target_canvas.y);
        ctx.stroke();
    }

    draw_pointer_E(ctx: CanvasRenderingContext2D, cell:XyPair, rgba_code: string) {
        const cell_center_canvas = new XyPair(cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
        const target_canvas = new XyPair(cell.x * BoardStateService.cell_res + BoardStateService.cell_res, cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
        ctx.strokeStyle = rgba_code;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cell_center_canvas.x, cell_center_canvas.y);
        ctx.lineTo(target_canvas.x, target_canvas.y);
        ctx.stroke();
    }

    draw_pointer_S(ctx: CanvasRenderingContext2D, cell:XyPair, rgba_code: string) {
        const cell_center_canvas = new XyPair(cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
        const target_canvas = new XyPair(cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, cell.y * BoardStateService.cell_res + BoardStateService.cell_res);
        ctx.strokeStyle = rgba_code;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cell_center_canvas.x, cell_center_canvas.y);
        ctx.lineTo(target_canvas.x, target_canvas.y);
        ctx.stroke();
    }

    draw_pointer_W(ctx: CanvasRenderingContext2D, cell:XyPair, rgba_code: string) {
        const cell_center_canvas = new XyPair(cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
        const target_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
        ctx.strokeStyle = rgba_code;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cell_center_canvas.x, cell_center_canvas.y);
        ctx.lineTo(target_canvas.x, target_canvas.y);
        ctx.stroke();
    }

    draw_pointer_NW(ctx: CanvasRenderingContext2D, cell:XyPair, rgba_code: string) {
        const cell_center_canvas = new XyPair(cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
        const target_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.strokeStyle = rgba_code;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cell_center_canvas.x, cell_center_canvas.y);
        ctx.lineTo(target_canvas.x, target_canvas.y);
        ctx.stroke();
    }

    draw_pointer_NE(ctx: CanvasRenderingContext2D, cell:XyPair, rgba_code: string) {
        const cell_center_canvas = new XyPair(cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
        const target_canvas = new XyPair(cell.x * BoardStateService.cell_res + BoardStateService.cell_res, cell.y * BoardStateService.cell_res);
        ctx.strokeStyle = rgba_code;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cell_center_canvas.x, cell_center_canvas.y);
        ctx.lineTo(target_canvas.x, target_canvas.y);
        ctx.stroke();
    }

    draw_pointer_SE(ctx: CanvasRenderingContext2D, cell:XyPair, rgba_code: string) {
        const cell_center_canvas = new XyPair(cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
        const target_canvas = new XyPair(cell.x * BoardStateService.cell_res + BoardStateService.cell_res, cell.y * BoardStateService.cell_res + BoardStateService.cell_res);
        ctx.strokeStyle = rgba_code;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cell_center_canvas.x, cell_center_canvas.y);
        ctx.lineTo(target_canvas.x, target_canvas.y);
        ctx.stroke();
    }

    draw_pointer_SW(ctx: CanvasRenderingContext2D, cell:XyPair, rgba_code: string) {
        const cell_center_canvas = new XyPair(cell.x * BoardStateService.cell_res + BoardStateService.cell_res / 2, cell.y * BoardStateService.cell_res + BoardStateService.cell_res / 2);
        const target_canvas = new XyPair(cell.x * BoardStateService.cell_res, cell.y * BoardStateService.cell_res  + BoardStateService.cell_res);
        ctx.strokeStyle = rgba_code;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cell_center_canvas.x, cell_center_canvas.y);
        ctx.lineTo(target_canvas.x, target_canvas.y);
        ctx.stroke();
    }
}
