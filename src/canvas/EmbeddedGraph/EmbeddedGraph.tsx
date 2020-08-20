import { Point } from "canvas/Geometry/Point";
import { Edge } from "./Edge";
import { Vector } from "canvas/Geometry/Vector";
import { Segment } from "canvas/Geometry/Segment";

export class EmbeddedGraph {
    // Precondition: the graph is planar and all faces are of finite area 
    //               and all faces have exactly 2 edges meeting at each vertex.
    // Returns an array of arrays, each array representing one face. Faces are
    // represented by the indices of the segments forming them in the 
    // array passed to the constructor
    static findFaces = (segments: Segment[]): number[][] => {
        let i = 0;
        const vertices = new Set<Point>();
        const edges: Edge[] = [];
        segments.forEach(segment => {
            i++;

            vertices.add(segment.getStart());
            vertices.add(segment.getEnd());

            edges.push(new Edge(segment, i));
            edges.push(new Edge(segment, -1 * i));
        });

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
            const face: Edge[] = [];                
            const faceEdgesIndices: number[] = [];
            let current = edge;
            let next = null;
            let totalAngle = 0;
            do {
                face.push(current);
                faceEdgesIndices.push(Math.abs(current.id) - 1);
                //console.log("adding edge " + current.id + " to current face" );
                totalAngle += current.getEdgeDirectionChange();
                //console.log("this edge turns by " + current.pathDirectionChange);

                const leavingEdges = leavingEdgesMap.get(current.destination);
                if (!leavingEdges) {
                    throw new Error();
                }
                // Find the index of the edge that is the reverse of current in leavingEdges
                const reverseEdgeId = (-1) * current.id;
                const indexOfReverse = leavingEdges.findIndex((edge: Edge) => edge.id === reverseEdgeId);

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

            // Only keep the face if the total angle while going around is 
            // -2PI. This means we have found an interior face, not the face
            // that is the exterior of the graph.
            addFace = addFace && Math.abs(totalAngle + 2 * Math.PI) < 1e-10; //epsilon
            //console.log("totalAngle: " + totalAngle);

            if (addFace) {
                faces.push(faceEdgesIndices);
                console.log("accept face " + faceEdgesIndices);
            }
        });

        // Compare the number of faces we found in our algorithm 
        // with the actual number of faces according to Euler's planar 
        // graph formula, reduced by one because we excluded the face 
        // that is the outside of the graph
        if (faces.length !== (2 - vertices.size + segments.length - 1) ) {
            console.log("The findFaces algorithm failed");
        }

        return faces;
    };
}