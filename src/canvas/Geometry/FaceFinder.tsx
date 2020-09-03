import { Point } from 'canvas/Geometry/Point';
import { Vector } from 'canvas/Geometry/Vector';
import { Segment } from 'canvas/Geometry/Segment';

interface Edge {
    origin: Point;
    destination: Point;
    tangentAtOrigin: Vector;
    tangentAtDestination: Vector;
    index: number; // the index of the segment
}

export class FaceFinder {
    
    /**
     * Precondition: the graph formed by the segments is planar, all faces are 
     *               of finite area, and when taken individually, all faces have
     *               exactly 2 segments meeting at each vertex.
     * Returns an array of arrays of indices, each inner array representing one face. 
     * Each inner array contains the indices of the segments forming the
     * face in the inputted segments array. The inner array's order indicates
     * how to go around the face in the negative direction.
     */
    static FindFaces = (segments: Segment[]): number[][] => {
        const vertices = FaceFinder._findVertices(segments);
        const edges = FaceFinder._findEdges(segments, vertices);

        // Create a map between vertices and an ordered array of all its
        // outgoing edges, ordered by angle of departure from the vertex
        const leavingEdgesMap = FaceFinder._createLeavingEdgesMap(vertices, edges);

        const faces = new Array<Array<number>>();

        /**
         * Starting from each edge, find the face to its left by cycling 
         * back to the same edge, always choosing the path that curves 
         * the most in the positive rotation direction at intersections.
         */
        edges.forEach(startingEdge => {
            const faceEdgesIndices: number[] = [];
            let current = startingEdge;
            let next = null;
            // The algorithm will find the same face multiple times, for 
            // example: [1, 4, 2], [4, 2, 1] and [2, 1, 4].
            // In order to keep one unique representation per face, we 
            // only keep edge lists that have the smallest index in the 
            // first position in the list.
            const indexOfFirst = current.index;
            let faceHasSmallestIndexFirst = true;
            // Only keep the face if the total angle while going around is 
            // 2PI. This means we have found an interior face, not the face
            // that is the exterior of the graph (which will have a 
            // totalAngle of -2PI).
            let totalAngle = 0;
            do {
                faceEdgesIndices.push(current.index);
                totalAngle += Vector.changeInAngle(current.tangentAtOrigin, current.tangentAtDestination);

                const leavingEdges = leavingEdgesMap.get(current.destination);
                if (!leavingEdges) {
                    throw new Error();
                }

                // Find the index of the edge that follows the same path as 
                // current but in the reverse direction in leavingEdges
                const currentIndex = current.index;
                const indexOfReverse = leavingEdges.findIndex((edge: Edge) => 
                    edge.index === currentIndex
                );

                // Choose the leaving edge next to the reverse in the list, 
                // going around in the negative direction
                next = leavingEdges[(indexOfReverse - 1 + leavingEdges.length) % leavingEdges.length];
                if (next.index < indexOfFirst) {
                    faceHasSmallestIndexFirst = false;
                    break;
                }
                
                totalAngle += Vector.changeInAngle(current.tangentAtDestination, next.tangentAtOrigin);
                
                current = next;
            } while (current.index !== startingEdge.index);

            // In order to allow small rounding errors, we test for a small difference instead of equality.
            const epsilon = 1e-10;
            if (faceHasSmallestIndexFirst && Math.abs(totalAngle - (2 * Math.PI)) < epsilon) {
                faces.push(faceEdgesIndices);
            }
        });

        // Compare the number of faces we found in our algorithm 
        // with the theoretical number of faces according to Euler's planar 
        // graph formula, reduced by one because we excluded the face 
        // that is the outside of the graph.
        if (faces.length < ((2 - vertices.length + segments.length) - 1)) {
            // Todo: throw error
            console.log("The number of faces found by the findFaces algorithm is too low");
        } else if (faces.length > ((2 - vertices.length + segments.length) - 1)) {
            // Todo: throw error
            console.log("The number of faces found by the findFaces algorithm is too high");
        }

        return faces;
    };   

    private static _findVertices = (segments: Segment[]): Point[] => {
        const vertices = [];
        for (let i = 0; i < segments.length; i++) {
            const segmentStart = segments[i].getStart().clone();
            const segmentEnd = segments[i].getEnd().clone();
            let addStart = true;
            let addEnd = true;
            // start and end cannot be equal per the Segment constructor,
            // so we can check for both at the same time
            vertices.forEach(otherVertex => {
                if (otherVertex.equals(segmentStart)) {
                    addStart = false;
                }

                if (otherVertex.equals(segmentEnd)) {
                    addEnd = false;
                }

            });
            if (addStart) {
                vertices.push(segmentStart);
            }

            if (addEnd) {
                vertices.push(segmentEnd);
            }

        }
        return vertices;
    };

    private static _findEdges = (segments: Segment[], vertices: Point[]): Edge[] => {
        const edges: Edge[] = [];
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const startVertex = vertices.find((vertex) => vertex.equals(segment.getStart()));
            const endVertex = vertices.find((vertex) => vertex.equals(segment.getEnd()));
            if (!startVertex || !endVertex) {
                throw new Error("Could not find the segment's endpoint in the vertices array");
            }

            edges.push({
                origin: startVertex, 
                destination: endVertex, 
                tangentAtOrigin: segment.getTangent(0), 
                tangentAtDestination: segment.getTangent(1), 
                index: i
            });
            edges.push({
                origin: endVertex, 
                destination: startVertex, 
                tangentAtOrigin: Vector.findOpposite(segment.getTangent(1)), 
                tangentAtDestination: Vector.findOpposite(segment.getTangent(0)), 
                index: i
            });
        }
        return edges;
    };

    /**
     * Returns a map between each vertex in vertices and an array of all the edges in the 
     * input edges array that have that particular vertex as an origin 
     * (they are "leaving" the vertex). 
     * 
     * @param vertices A set of Points.
     * @param edges An array of Edges.
     */
    private static _createLeavingEdgesMap = (vertices: Point[], edges: Edge[]): Map<Point, Edge[]> => {
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
        return leavingEdgesMap;
    };
}