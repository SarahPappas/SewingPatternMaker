import { Point } from "canvas/Geometry/Point";
import { Vector } from "canvas/Geometry/Vector";
import { Segment } from "canvas/Geometry/Segment";

interface Edge {
    origin: Point;
    destination: Point;
    tangentAtOrigin: Vector;
    tangentAtDestination: Vector;
    index: number; // the index of the segment
}

class FaceFinder {
    
    /**
     * Precondition: the graph formed by the segments is planar, all faces are 
     *               of finite area, and when taken individually, all faces have
     *               exactly 2 segments meeting at each vertex.
     * Returns an array of arrays of indices, each inner array representing one face. 
     * Each inner array contains the indices of the segments forming the
     * face in the inputted segments array.
     */
    static FindFaces = (segments: Segment[]): number[][] => {
        const vertices = new Set<Point>();
        const edges: Edge[] = [];
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            vertices.add(segment.getStart());
            vertices.add(segment.getEnd());

            edges.push({
                origin: segment.getStart(), 
                destination: segment.getEnd(), 
                tangentAtOrigin: segment.getTangent(0), 
                tangentAtDestination: segment.getTangent(1), 
                index: i
            });
            edges.push({
                origin: segment.getEnd(), 
                destination: segment.getStart(), 
                tangentAtOrigin: segment.getTangent(1).opposite(), 
                tangentAtDestination: segment.getTangent(0).opposite(), 
                index: i
            });
        }

        // Create a map between vertices and an ordered array of all its
        // outgoing edges, ordered by angle of departure from the vertex
        const leavingEdgesMap = new Map();
        vertices.forEach(vertex => {
            const leavingEdges: Array<Edge> = [];
            edges.forEach(edge => {
                if (edge.origin.equals(vertex)) {
                    leavingEdges.push(edge);
                }
            });
            leavingEdges.sort((a, b) => a.tangentAtOrigin.getAngle() - b.tangentAtOrigin.getAngle());
            leavingEdgesMap.set(vertex, leavingEdges);
        });  

        const faces = new Array<Array<number>>();

        edges.forEach(edge => {
            const faceEdgesIndices: number[] = [];
            let current = edge;
            let next = null;
            // The algorithm will find the same face multiple times, for example: [1, 4, 2], 
            // [4, 2, 1], [2, 1, 4].
            // In order to keep one unique representation per face, we only keep edge lists 
            // that have the smallest index in the first position in the list.
            const indexOfFirst = Math.abs(current.index);
            let faceHasSmallestIndexFirst = true;
            // Only keep the face if the total angle while going around is 
            // -2PI. This means we have found an interior face, not the face
            // that is the exterior of the graph (which will have a totalAngle of +2PI).
            let totalAngle = 0;
            do {
                faceEdgesIndices.push(current.index);
                //console.log("adding edge " + current.id + " to current face" );
                totalAngle += Vector.changeInAngle(current.tangentAtOrigin, current.tangentAtDestination);
                //console.log("this edge turns by " + current.pathDirectionChange);

                const leavingEdges = leavingEdgesMap.get(current.destination);
                if (!leavingEdges) {
                    throw new Error();
                }
                // Find the index of the edge that is the reverse of current in leavingEdges
                const currentIndex = current.index;
                const indexOfReverse = leavingEdges.findIndex((edge: Edge) => 
                    edge.index === currentIndex
                );

                // Choose the next edge leaving the vertex
                next = leavingEdges[(indexOfReverse + 1) % leavingEdges.length];
                if (next.index < indexOfFirst) {
                    faceHasSmallestIndexFirst = false;
                    break;
                }
                
                totalAngle += Vector.changeInAngle(current.tangentAtDestination, next.tangentAtOrigin);
                //console.log("from this edge to the next, we turn by " + (angleBetween));
                
                current = next;
            } while (current.index !== edge.index);// while not back

            if (faceHasSmallestIndexFirst && Math.abs(totalAngle + 2 * Math.PI) < 1e-10) {
                faces.push(faceEdgesIndices);
                console.log("accept face " + faceEdgesIndices);
            }
            //console.log("totalAngle: " + totalAngle);
        });

        // Compare the number of faces we found in our algorithm 
        // with the theoretical number of faces according to Euler's planar 
        // graph formula, reduced by one because we excluded the face 
        // that is the outside of the graph.
        if (faces.length < ((2 - vertices.size + segments.length) - 1)) {
            // Todo: throw error
            console.log("The number of faces found by the findFaces algorithm is too low");
        } else if (faces.length > ((2 - vertices.size + segments.length) - 1)) {
            // Todo: throw error
            console.log("The number of faces found by the findFaces algorithm is too high");
        }

        return faces;
    };   
}

export { FaceFinder };
