import { Point } from "canvas/Geometry/Point";
import { Edge } from "./Edge";
import { Vector } from "canvas/Geometry/Vector";
import { Segment } from "canvas/Geometry/Segment";

export class EmbeddedGraph {
    vertices: Set<Point>;
    edges: Edge[];
    leavingEdgesMap: Map<Point, Array<Edge>>;

    constructor(segments: Segment[]) {
        let i = 0;
        this.vertices = new Set<Point>();
        this.edges = [];
        segments.forEach(segment => {
            i++;

            this.vertices.add(segment.getStart());
            this.vertices.add(segment.getEnd());

            this.edges.push(new Edge(segment, i));
            this.edges.push(new Edge(segment, -1 * i));
        });

        this.leavingEdgesMap = new Map();
        this.vertices.forEach(vertex => {
            const leavingEdges: Array<Edge> = [];
            this.edges.forEach(edge => {
                if (edge.origin.equals(vertex)) {
                    leavingEdges.push(edge);
                }
            });
            leavingEdges.sort((a, b) => a.tangentAtOrigin.getAngle() - b.tangentAtOrigin.getAngle());
            this.leavingEdgesMap.set(vertex, leavingEdges);
        });        
    }

    findFaces = (): Edge[][] => {
        const faces = new Array<Array<Edge>>();
        this.edges.forEach(edge => {
            const face: Edge[] = [];
            const faceEdges: number[] = [];
            let current = edge;
            let next = null;
            let totalAngle = 0;
            //console.log("current: " + current.id);
            do {
                face.push(current);
                faceEdges.push(current.id);
                //console.log("adding edge " + current.id + " to current face" );
                totalAngle += current.getEdgeDirectionChange();
                //console.log("this edge turns by " + current.pathDirectionChange);

                const leavingEdges = this.leavingEdgesMap.get(current.destination);
                if (!leavingEdges) {
                    throw new Error();
                }
                // find the index of the edge that is the reverse of current in leavingEdges
                let index = -1;
                for (let i = 0; i < leavingEdges.length; i++) {
                    //console.log("leavingEdges[i].id = " + leavingEdges[i].id);
                    if (leavingEdges[i].id === (-1 * current.id)) {
                        index = i;
                        //console.log("match");
                        break;
                    }
                }
                if (index === -1) {
                    throw new Error();
                }
                // choose the next edge leaving the vertex clockwise
                next = leavingEdges[(index + leavingEdges.length - 1) % leavingEdges.length];
                totalAngle += Vector.changeInAngle(current.tangentAtDestination, next.tangentAtOrigin);
                //console.log("from this edge to the next, we turn by " + (angleBetween));
                current = next;
            } while (current.id !== edge.id);// while not back

            // the algorithm will find the same face multiple times, for example: [1, 3, 2], [3, 2, 1], [2, 1, 3].
            // In order to keep that face only once, we only keep the representation that has
            // the smallest id (in absolute value) in the first position in the list.
            const firstId = Math.abs(face[0].id);
            let addFace = true;
            for (let i = 1; i < face.length; i++) {
                if (firstId > Math.abs(face[i].id)) {
                    addFace = false;
                }
            }

            //console.log("totalAngle: " + totalAngle);
            addFace = addFace && Math.abs(totalAngle - 2 * Math.PI) < 1e-10; //epsilon

            if (addFace) {
                faces.push(face);
                console.log("accept face " + faceEdges);
            } else {
                //console.log("reject face");
            }
        });

        if (faces.length !== this.theoreticalNumberOfFaces() - 1) {
            console.log("The findFaces algorithm failed");
        }

        return faces;
    };

    theoreticalNumberOfFaces = (): number => {
        // according to Euler's formula for planar graphs
        return 2 - this.vertices.size + (this.edges.length / 2);
    }
}