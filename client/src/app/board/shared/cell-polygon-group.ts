import {CellTarget} from './cell-target';
import {CellTargetStatics} from '../services/cell-target-statics';

export class CellPolygonGroup {
    fill: Array<CellTarget>;
    border: Array<CellTarget>;

    constructor(fill: Array<CellTarget>) {
        this.fill = fill;
        // process the fill set and identify the corners compromising the border
        let edge_seeker = fill[0];
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