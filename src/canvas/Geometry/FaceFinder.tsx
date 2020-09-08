import { Point } from 'canvas/Geometry/Point';
import { Vector } from 'canvas/Geometry/Vector';
import { PatternPath } from 'canvas/PatternPaths/PatternPath';

export class FaceFinder {
    /**
     * Precondition: the graph formed by the PatternPaths is planar, all faces are 
     *               of finite area, and when taken individually, all faces have
     *               exactly 2 PatternPaths meeting at each vertex.
     * Returns an array of arrays of PatternPaths, each inner array representing one face. 
     * Each inner array contains ordered end-to-start consecutive paths that go around
     * the face in the positive rotation direction.
     */
    static FindFaces = (paths: PatternPath[]): PatternPath[][] => {
        // Vertices are unique for the whole graph.
        const vertices = FaceFinder._findVertices(paths);

        // Edges are objects that package paths with their start and end vertex and an id.
        // Each path generates 2 edges running in opposite direction, with the same id.
        const edges = FaceFinder._findEdges(paths, vertices);

        // Create a map between vertices and an ordered array of all its
        // outgoing edges, ordered by angle of departure from the vertex
        const leavingEdgesMap = FaceFinder._createLeavingEdgesMap(vertices, edges);

        const faces: IEdge[][] = [];

        // Starting from each edge, find the face to its right by traveling
        // along consecutive end-to-start edges, always choosing to leave a vertex
        // through the path that curves the most in the positive rotation 
        // direction.
        edges.forEach(startingEdge => {
            const face = [];
            let current = startingEdge;
            let next = null;
            // The algorithm will find the same face multiple times, for 
            // example: [1, 4, 2], [4, 2, 1] and [2, 1, 4].
            // In order to keep one unique representation per face, we 
            // only keep edge lists that have the smallest index in the 
            // first position in the list.
            const idOfFirst = current.id;
            let faceHasSmallestIdFirst = true;
            // Only keep the face if the total angle while going around is 
            // 2PI. This means we have found an interior face, not the face
            // that is the exterior of the graph (which will have a 
            // totalAngle of -2PI).
            let totalAngle = 0;
            do {
                face.push(current);
                totalAngle += Vector.changeInAngle(current.path.getTangentAtStart(), current.path.getTangentAtEnd());

                const leavingEdges = leavingEdgesMap.get(current.endVertex);
                if (!leavingEdges) {
                    throw new Error("Could not retreive the destination point of this edge in the vertex keys of the map");
                }

                // Find the id of the edge that follows the same path as 
                // current but in the reverse direction in leavingEdges
                const currentId = current.id;
                const indexOfReverse = leavingEdges.findIndex((edge: IEdge) => 
                    edge.id === currentId
                );

                // Choose the leaving edge next to the reverse in the list, 
                // going around in the negative direction
                next = leavingEdges[(indexOfReverse - 1 + leavingEdges.length) % leavingEdges.length];
                if (next.id < idOfFirst) {
                    faceHasSmallestIdFirst = false;
                    break;
                }
                
                totalAngle += Vector.changeInAngle(current.path.getTangentAtEnd(), next.path.getTangentAtStart());
                
                current = next;
            } while (current.id !== startingEdge.id);

            // In order to allow small rounding errors, we test for a small difference instead of equality.
            const epsilon = 1e-10;
            if (faceHasSmallestIdFirst && Math.abs(totalAngle - (2 * Math.PI)) < epsilon) {
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

        return faces.map(face => face.map(edge => edge.path));
    };   

    /**
     * Generate an array of unique endpoint among all of the inputted PatternPaths.
     * @param paths 
     */
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

    /**
     * Package all paths and their opposite in an IEdge type object with their 
     * start and end vertices in the vertices array and an id which will be the
     * same for a path and its reverse
     * 
     * @param paths 
     * @param vertices 
     */
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
                path: path.clone(),
                startVertex: startVertex, 
                endVertex: endVertex, 
                id: i
            });
            edges.push({
                path: path.reversedClone(),
                startVertex: endVertex, 
                endVertex: startVertex,
                id: i
            });
        }
        return edges;
    };

    /**
     * Returns a map between each vertex in vertices and an array of all the edges in the 
     * input edges array that have that particular vertex as a startVertex 
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
                if (edge.startVertex === vertex) {
                    leavingEdges.push(edge);
                }
            });
            leavingEdges.sort((a, b) => a.path.getTangentAtStart().getAngle() - b.path.getTangentAtStart().getAngle());
            leavingEdgesMap.set(vertex, leavingEdges);
        });  
        return leavingEdgesMap;
    };
}