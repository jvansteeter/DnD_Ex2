import {CellTarget} from '../shared/cell-target';
import {EdgeMoveDirection} from '../shared/enum/edge-move-direction';
import {EdgeMoveAction} from '../shared/edge-move-action';
import {CellRegion} from '../shared/enum/cell-region';
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import {Injectable} from '@angular/core';
import {BoardStateService} from '../services/board-state.service';

@Injectable()
export class CellTargetStatics {
     constructor(){}

     static getPointCanvasCoor(point: CellTarget): XyPair {
         const cellRes = BoardStateService.cell_res;
         if (point.region === CellRegion.CORNER) {
             return new XyPair(point.location.x * cellRes, point.location.y * cellRes);
         }
         if (point.region === CellRegion.CENTER) {
             return new XyPair(point.location.x * cellRes + (cellRes / 2), point.location.y * cellRes + (cellRes / 2));
         }
     }

     static getPointsOnQuad(quad: CellTarget): Array<CellTarget> {
         switch (quad.region) {
             case CellRegion.TOP_QUAD:
                 return [
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.CORNER),
                     new CellTarget(new XyPair(quad.location.x + 1, quad.location.y), CellRegion.CORNER),
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.CENTER)
                 ];
             case CellRegion.RIGHT_QUAD:
                 return [
                     new CellTarget(new XyPair(quad.location.x + 1, quad.location.y), CellRegion.CORNER),
                     new CellTarget(new XyPair(quad.location.x + 1, quad.location.y + 1), CellRegion.CORNER),
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.CENTER)
                 ];
             case CellRegion.BOTTOM_QUAD:
                 return [
                     new CellTarget(new XyPair(quad.location.x, quad.location.y + 1), CellRegion.CORNER),
                     new CellTarget(new XyPair(quad.location.x + 1, quad.location.y + 1), CellRegion.CORNER),
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.CENTER)
                 ];
             case CellRegion.LEFT_QUAD:
                 return [
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.CORNER),
                     new CellTarget(new XyPair(quad.location.x, quad.location.y + 1), CellRegion.CORNER),
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.CENTER)
                 ];
         }
     }

     static getQuadsAdjacentToQuad(quad: CellTarget): Array<CellTarget> {
         switch (quad.region) {
             case CellRegion.TOP_QUAD:
                 return [
                     new CellTarget(new XyPair(quad.location.x, quad.location.y - 1), CellRegion.BOTTOM_QUAD),
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.LEFT_QUAD),
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.RIGHT_QUAD)];
             case CellRegion.RIGHT_QUAD:
                 return [
                     new CellTarget(new XyPair(quad.location.x + 1, quad.location.y), CellRegion.LEFT_QUAD),
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.TOP_QUAD),
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.BOTTOM_QUAD)];
             case CellRegion.BOTTOM_QUAD:
                 return [
                     new CellTarget(new XyPair(quad.location.x, quad.location.y + 1), CellRegion.TOP_QUAD),
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.LEFT_QUAD),
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.RIGHT_QUAD)];
             case CellRegion.LEFT_QUAD:
                 return [
                     new CellTarget(new XyPair(quad.location.x - 1, quad.location.y), CellRegion.RIGHT_QUAD),
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.TOP_QUAD),
                     new CellTarget(new XyPair(quad.location.x, quad.location.y), CellRegion.BOTTOM_QUAD)];
         }
     }

     static edgeTraverse(point: CellTarget, direction: EdgeMoveDirection): EdgeMoveAction {
         if (point.region === CellRegion.CENTER) {
             switch (direction) {
                 case EdgeMoveDirection.NORTH_EAST:
                     return new EdgeMoveAction(point,
                         new CellTarget(new XyPair(point.location.x + 1, point.location.y), CellRegion.CORNER),
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.TOP_QUAD),
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.RIGHT_QUAD));
                 case EdgeMoveDirection.SOUTH_EAST:
                     return new EdgeMoveAction(point,
                         new CellTarget(new XyPair(point.location.x + 1, point.location.y + 1), CellRegion.CORNER),
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.RIGHT_QUAD),
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.BOTTOM_QUAD));
                 case EdgeMoveDirection.SOUTH_WEST:
                     return new EdgeMoveAction(point,
                         new CellTarget(new XyPair(point.location.x, point.location.y + 1), CellRegion.CORNER),
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.BOTTOM_QUAD),
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.LEFT_QUAD));
                 case EdgeMoveDirection.NORTH_WEST:
                     return new EdgeMoveAction(point,
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.CORNER),
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.LEFT_QUAD),
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.TOP_QUAD));
             }
         }

         if (point.region === CellRegion.CORNER) {
             switch (direction) {
                 case EdgeMoveDirection.NORTH:
                     return new EdgeMoveAction(point,
                         new CellTarget(new XyPair(point.location.x, point.location.y - 1), CellRegion.CORNER),
                         new CellTarget(new XyPair(point.location.x - 1, point.location.y - 1), CellRegion.RIGHT_QUAD),
                         new CellTarget(new XyPair(point.location.x, point.location.y - 1), CellRegion.LEFT_QUAD));
                 case EdgeMoveDirection.NORTH_EAST:
                     return new EdgeMoveAction(point,
                         new CellTarget(new XyPair(point.location.x, point.location.y - 1), CellRegion.CENTER),
                         new CellTarget(new XyPair(point.location.x, point.location.y - 1), CellRegion.LEFT_QUAD),
                         new CellTarget(new XyPair(point.location.x, point.location.y - 1), CellRegion.BOTTOM_QUAD));
                 case EdgeMoveDirection.EAST:
                     return new EdgeMoveAction(point,
                         new CellTarget(new XyPair(point.location.x + 1, point.location.y), CellRegion.CORNER),
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.TOP_QUAD),
                         new CellTarget(new XyPair(point.location.x, point.location.y - 1), CellRegion.BOTTOM_QUAD));
                 case EdgeMoveDirection.SOUTH_EAST:
                     return new EdgeMoveAction(point,
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.CENTER),
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.TOP_QUAD),
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.LEFT_QUAD));
                 case EdgeMoveDirection.SOUTH:
                     return new EdgeMoveAction(point,
                         new CellTarget(new XyPair(point.location.x, point.location.y + 1), CellRegion.CORNER),
                         new CellTarget(new XyPair(point.location.x, point.location.y), CellRegion.LEFT_QUAD),
                         new CellTarget(new XyPair(point.location.x - 1, point.location.y), CellRegion.RIGHT_QUAD));
                 case EdgeMoveDirection.SOUTH_WEST:
                     return new EdgeMoveAction(point,
                         new CellTarget(new XyPair(point.location.x - 1, point.location.y), CellRegion.CENTER),
                         new CellTarget(new XyPair(point.location.x - 1, point.location.y), CellRegion.TOP_QUAD),
                         new CellTarget(new XyPair(point.location.x - 1, point.location.y), CellRegion.RIGHT_QUAD));
                 case EdgeMoveDirection.WEST:
                     return new EdgeMoveAction(point,
                         new CellTarget(new XyPair(point.location.x - 1, point.location.y), CellRegion.CORNER),
                         new CellTarget(new XyPair(point.location.x - 1, point.location.y), CellRegion.TOP_QUAD),
                         new CellTarget(new XyPair(point.location.x - 1, point.location.y - 1), CellRegion.BOTTOM_QUAD));
                 case EdgeMoveDirection.NORTH_WEST:
                     return new EdgeMoveAction(point,
                         new CellTarget(new XyPair(point.location.x - 1, point.location.y - 1), CellRegion.CENTER),
                         new CellTarget(new XyPair(point.location.x - 1, point.location.y - 1), CellRegion.RIGHT_QUAD),
                         new CellTarget(new XyPair(point.location.x - 1, point.location.y - 1), CellRegion.BOTTOM_QUAD));
             }
         }
     }
}
