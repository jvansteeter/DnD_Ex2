import {CellTarget} from '../shared/cell-target';
import {EdgeMoveDirection} from '../shared/enum/edge-move-direction';
import {EdgeMoveAction} from '../shared/edge-move-action';
import {CellRegion} from '../shared/enum/cell-region';
import {XyPair} from '../geometry/xy-pair';

export class CellTargetStatics {
     constructor(){}

     static getCornersOnEdge(edge: CellTarget): Array<CellTarget> {
         switch (edge.region) {
             case CellRegion.TOP_EDGE:
                 return [
                     new CellTarget(new XyPair(edge.location.x, edge.location.y), CellRegion.CORNER),
                     new CellTarget(new XyPair(edge.location.x + 1, edge.location.y), CellRegion.CORNER),
                 ];
             case CellRegion.LEFT_EDGE:
                 return [
                     new CellTarget(new XyPair(edge.location.x, edge.location.y), CellRegion.CORNER),
                     new CellTarget(new XyPair(edge.location.x, edge.location.y + 1), CellRegion.CORNER),
                 ];
             case CellRegion.FWRD_EDGE:
                 return [
                     new CellTarget(new XyPair(edge.location.x + 1, edge.location.y), CellRegion.CORNER),
                     new CellTarget(new XyPair(edge.location.x - 1, edge.location.y - 1), CellRegion.CORNER),
                 ];
             case CellRegion.BKWD_EDGE:
                 return [
                     new CellTarget(new XyPair(edge.location.x, edge.location.y), CellRegion.CORNER),
                     new CellTarget(new XyPair(edge.location.x + 1, edge.location.y + 1), CellRegion.CORNER),
                 ];
         }
     }

     // static getQuadsOnCorner(corner: CellTarget): Array<CellTarget> {
     //
     // }

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
                         new CellTarget(new XyPair(point.location.x - 1, point.location.y + 1), CellRegion.RIGHT_QUAD));
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
