import { Point } from "canvas/Geometry/Point";
import { Vector } from "canvas/Geometry/Vector";
import { Segment } from "canvas/Geometry/Segment";

export class Edge {
    origin: Point;
    destination: Point;
    tangentAtOrigin: Vector;
    tangentAtDestination: Vector;
    id: number;

    constructor(segment: Segment, id: number) {
        if (id === 0) {
            throw new Error();
        }
        this.id = id;

        if (id > 0) {
            // follow path direction
            this.origin = segment.getStart();
            this.destination = segment.getEnd();

            this.tangentAtOrigin = segment.getTangent(0);
            this.tangentAtDestination = segment.getTangent(1);
        } else { // id < 0
            // follow reverse path direction
            this.origin = segment.getEnd();
            this.destination = segment.getStart();

            this.tangentAtOrigin = segment.getTangent(1).opposite();
            this.tangentAtDestination = segment.getTangent(0).opposite();
        }
    }

    getEdgeDirectionChange = () => {
        return Vector.changeInAngle(this.tangentAtOrigin, this.tangentAtDestination);
    };
}