import { Point } from 'canvas/Geometry/Point';
import { Vector } from 'canvas/Geometry/Vector';
import { PatternPath } from 'canvas/PatternPaths/PatternPath';

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
    static FindFaces = (paths: PatternPath[]): IEdge[][] => {
        const vertices = FaceFinder._findVertices(paths);
        const edges = FaceFinder._findEdges(paths, vertices);

        // Create a map between vertices and an ordered array of all its
        // outgoing edges, ordered by angle of departure from the vertex
        const leavingEdgesMap = FaceFinder._createLeavingEdgesMap(vertices, edges);

        const faces: IEdge[][] = [];

        /**
         * Starting from each edge, find the face to its left by cycling 
         * back to the same edge, always choosing the path that curves 
         * the most in the positive rotation direction at intersections.
         */
        edges.forEach(startingEdge => {
            const face = [];
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
                face.push(current);
                totalAngle += Vector.changeInAngle(current.tangentAtOrigin, current.tangentAtDestination);

                const leavingEdges = leavingEdgesMap.get(current.destination);
                if (!leavingEdges) {
                    throw new Error("Could not retreive the destination point of this edge in the vertex keys of the map");
                }

                // Find the index of the edge that follows the same path as 
                // current but in the reverse direction in leavingEdges
                const currentIndex = current.index;
                const indexOfReverse = leavingEdges.findIndex((edge: IEdge) => 
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
                faces.push(face);
            }
        });

        // Compare the number of faces we found in our algorithm 
        // with the theoretical number of faces according to Euler's planar 
        // graph formula, reduced by one because we excluded the face 
        // that is the outside of the graph.
        if (faces.length < ((2 - vertices.length + paths.length) - 1)) {
            throw new Error("The number of faces found by the findFaces algorithm is too low");
        } else if (faces.length > ((2 - vertices.length + paths.length) - 1)) {
            throw new Error("The number of faces found by the findFaces algorithm is too high");
        }

        return faces;
    };   

    private static _findVertices = (paths: PatternPath[]): Point[] => {
        const vertices = [];
        for (let i = 0; i < paths.length; i++) {
            let addStart = true;
            let addEnd = true;
            // start and end cannot be equal per the Segment constructor,
            // so we can check for both at the same time
            vertices.forEach(otherVertex => {
                if (otherVertex.equals(paths[i].getStart())) {
                    addStart = false;
                }

                if (otherVertex.equals(paths[i].getEnd())) {
                    addEnd = false;
                }

            });
            if (addStart) {
                vertices.push(paths[i].getStart());
            }

            if (addEnd) {
                vertices.push(paths[i].getEnd());
            }

        }
        return vertices;
    };

    private static _findEdges = (paths: PatternPath[], vertices: Point[]): IEdge[] => {
        const edges: IEdge[] = [];
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const startVertex = vertices.find((vertex) => vertex.equals(path.getStart()));
            const endVertex = vertices.find((vertex) => vertex.equals(path.getEnd()));
            if (!startVertex || !endVertex) {
                throw new Error("Could not find the segment's endpoint in the vertices array");
            }

            edges.push({
                origin: startVertex, 
                destination: endVertex, 
                tangentAtOrigin: path.getTangentAtStart(), 
                tangentAtDestination: path.getTangentAtEnd(), 
                index: i,
                isReversed: false
            });
            edges.push({
                origin: endVertex, 
                destination: startVertex, 
                tangentAtOrigin: Vector.findOpposite(path.getTangentAtEnd()), 
                tangentAtDestination: Vector.findOpposite(path.getTangentAtStart()), 
                index: i,
                isReversed: true
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
    private static _createLeavingEdgesMap = (vertices: Point[], edges: IEdge[]): Map<Point, IEdge[]> => {
        const leavingEdgesMap = new Map();
        vertices.forEach(vertex => {
            const leavingEdges: Array<IEdge> = [];
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