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
            // The faceEdgesIds variable is only useful for console logging and debugging
            const faceEdgesIds: number[] = [];
            let current = edge;
            let next = null;
            let totalAngle = 0;
            do {
                face.push(current);
                faceEdgesIds.push(current.id);
                //console.log("adding edge " + current.id + " to current face" );
                totalAngle += current.getEdgeDirectionChange();
                //console.log("this edge turns by " + current.pathDirectionChange);

                const leavingEdges = this.leavingEdgesMap.get(current.destination);
                if (!leavingEdges) {
                    throw new Error();
                }
                // Find the index of the edge that is the reverse of current in leavingEdges
                const reverseEdgeId = (-1) * current.id;
                const indexOfReverse = leavingEdges.findIndex((edge) => edge.id === reverseEdgeId);

                // Choose the next edge leaving the vertex
                next = leavingEdges[(indexOfReverse + 1) % leavingEdges.length];
                
                totalAngle += Vector.changeInAngle(current.tangentAtDestination, next.tangentAtOrigin);
                //console.log("from this edge to the next, we turn by " + (angleBetween));
                
                current = next;
            } while (current.id !== edge.id);// while not back

            // The algorithm will find the same face multiple times, for example: [1, 3, 2], [3, 2, 1], [2, 1, 3].
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
            // Only keep the face if the total angle while going around is 
            // -2PI. This means we have found an interior face, not the face
            // that is the exterior of the graph.
            addFace = addFace && Math.abs(totalAngle + 2 * Math.PI) < 1e-10; //epsilon

            if (addFace) {
                faces.push(face);
                console.log("accept face " + faceEdgesIds);
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