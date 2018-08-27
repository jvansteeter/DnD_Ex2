import {CellTarget} from './cell-target';
import {CellTargetStatics} from '../statics/cell-target-statics';
import {EdgeMoveDirection} from './enum/edge-move-direction';
import {CellRegion} from './enum/cell-region';

export class CellPolygonGroup {
    fill: Array<CellTarget>;
    border: Array<CellTarget>;

    constructor(fill: Array<CellTarget>) {
        this.fill = fill;
        this.border = [];

        this.syncBorder();
    }

    private syncBorder() {
        // process the fill set and identify the corners compromising the border
        let edge_seeker = this.fill[0];
        const edge_seeker_set = new Set<string>();
        edge_seeker_set.add(edge_seeker.hash());
        while (!this.quadIsOnEdge(edge_seeker)) {
            const next_quads = CellTargetStatics.getQuadsAdjacentToQuad(edge_seeker);
            for (const next_quad of next_quads) {
                if (!edge_seeker_set.has(next_quad.hash())) {
                    edge_seeker = next_quad;
                    edge_seeker_set.add(edge_seeker.hash());
                    break;
                }
            }
        }
        // edge seeker should now be a quad target on the edge of the polygon
        const points = CellTargetStatics.getPointsOnQuad(edge_seeker);

        let traverse_point;
        const touchedPoints = new Set<string>();

        for (const point of points) {
            let edge_move = CellTargetStatics.edgeTraverse(point, EdgeMoveDirection.NORTH_EAST);
            if (this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                traverse_point = point;
                this.border.push(traverse_point);
                touchedPoints.add(traverse_point.hash());
                break;
            }
            edge_move = CellTargetStatics.edgeTraverse(point, EdgeMoveDirection.SOUTH_EAST);
            if (this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                traverse_point = point;
                this.border.push(traverse_point);
                touchedPoints.add(traverse_point.hash());
                break;
            }
            edge_move = CellTargetStatics.edgeTraverse(point, EdgeMoveDirection.SOUTH_WEST);
            if (this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                traverse_point = point;
                this.border.push(traverse_point);
                touchedPoints.add(traverse_point.hash());
                break;
            }
            edge_move = CellTargetStatics.edgeTraverse(point, EdgeMoveDirection.NORTH_WEST);
            if (this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                traverse_point = point;
                this.border.push(traverse_point);
                touchedPoints.add(traverse_point.hash());
                break;
            }

            if (point.region === CellRegion.CORNER) {
                edge_move = CellTargetStatics.edgeTraverse(point, EdgeMoveDirection.NORTH);
                if (this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                    traverse_point = point;
                    this.border.push(traverse_point);
                    touchedPoints.add(traverse_point.hash());
                    break;
                }
                edge_move = CellTargetStatics.edgeTraverse(point, EdgeMoveDirection.EAST);
                if (this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                    traverse_point = point;
                    this.border.push(traverse_point);
                    touchedPoints.add(traverse_point.hash());
                    break;
                }
                edge_move = CellTargetStatics.edgeTraverse(point, EdgeMoveDirection.SOUTH);
                if (this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                    traverse_point = point;
                    this.border.push(traverse_point);
                    touchedPoints.add(traverse_point.hash());
                    break;
                }
                edge_move = CellTargetStatics.edgeTraverse(point, EdgeMoveDirection.WEST);
                if (this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                    traverse_point = point;
                    this.border.push(traverse_point);
                    touchedPoints.add(traverse_point.hash());
                    break;
                }
            }
        }


        let nowhereToGo = false;
        while (!nowhereToGo) {
            let edge_move = CellTargetStatics.edgeTraverse(traverse_point, EdgeMoveDirection.NORTH_EAST);
            if (!touchedPoints.has(edge_move.targetPoint.hash()) && this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                traverse_point = edge_move.targetPoint;
                this.border.push(traverse_point);
                touchedPoints.add(traverse_point.hash());
                continue;
            }

            edge_move = CellTargetStatics.edgeTraverse(traverse_point, EdgeMoveDirection.SOUTH_EAST);
            if (!touchedPoints.has(edge_move.targetPoint.hash()) && this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                traverse_point = edge_move.targetPoint;
                this.border.push(traverse_point);
                touchedPoints.add(traverse_point.hash());
                continue;
            }

            edge_move = CellTargetStatics.edgeTraverse(traverse_point, EdgeMoveDirection.SOUTH_WEST);
            if (!touchedPoints.has(edge_move.targetPoint.hash()) && this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                traverse_point = edge_move.targetPoint;
                this.border.push(traverse_point);
                touchedPoints.add(traverse_point.hash());
                continue;
            }

            edge_move = CellTargetStatics.edgeTraverse(traverse_point, EdgeMoveDirection.NORTH_WEST);
            if (!touchedPoints.has(edge_move.targetPoint.hash()) && this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                traverse_point = edge_move.targetPoint;
                this.border.push(traverse_point);
                touchedPoints.add(traverse_point.hash());
                continue;
            }

            if (traverse_point.region === CellRegion.CORNER) {
                edge_move = CellTargetStatics.edgeTraverse(traverse_point, EdgeMoveDirection.NORTH);
                if (!touchedPoints.has(edge_move.targetPoint.hash()) && this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                    traverse_point = edge_move.targetPoint;
                    this.border.push(traverse_point);
                    touchedPoints.add(traverse_point.hash());
                    continue;
                }

                edge_move = CellTargetStatics.edgeTraverse(traverse_point, EdgeMoveDirection.EAST);
                if (!touchedPoints.has(edge_move.targetPoint.hash()) && this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                    traverse_point = edge_move.targetPoint;
                    this.border.push(traverse_point);
                    touchedPoints.add(traverse_point.hash());
                    continue;
                }

                edge_move = CellTargetStatics.edgeTraverse(traverse_point, EdgeMoveDirection.SOUTH);
                if (!touchedPoints.has(edge_move.targetPoint.hash()) && this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                    traverse_point = edge_move.targetPoint;
                    this.border.push(traverse_point);
                    touchedPoints.add(traverse_point.hash());
                    continue;
                }

                edge_move = CellTargetStatics.edgeTraverse(traverse_point, EdgeMoveDirection.WEST);
                if (!touchedPoints.has(edge_move.targetPoint.hash()) && this.quadsAreEdge(edge_move.quadOne, edge_move.quadTwo)) {
                    traverse_point = edge_move.targetPoint;
                    this.border.push(traverse_point);
                    touchedPoints.add(traverse_point.hash());
                    continue;
                }
            }

            nowhereToGo = true;
        }
    }

    private quadsAreEdge(quadOne: CellTarget, quadTwo: CellTarget): boolean {
        return (
            (!this.fillHasQuad(quadOne) && (this.fillHasQuad(quadTwo))) ||
            (!this.fillHasQuad(quadTwo) && (this.fillHasQuad(quadOne)))
        );
    }

    private quadIsOnEdge(source_quad: CellTarget): boolean {
        const quads = CellTargetStatics.getQuadsAdjacentToQuad(source_quad);
        for (const quad of quads) {
            if (!this.fillHasQuad(quad)) {
                return true;
            }
        }
        return false;
    }

    private fillHasQuad(search_quad): boolean {
        for (const quad of this.fill) {
            if (quad.hash() === search_quad.hash()) {
                return true;
            }
        }
        return false;
    }


}