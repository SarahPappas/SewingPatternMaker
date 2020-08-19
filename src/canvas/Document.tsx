import { PatternPath } from './PatternPaths/PatternPath';
import { Point } from './Geometry/Point';

export class Document implements IDocument {
    private _patternPaths: PatternPath[];
    private _sizeRatio: null | number; // in pixels per inch

    private _vertices: Set<Point>;
    private _edges: Edge[];
    private _patternPieces: Set<Edge[]>;

    constructor () {
        this._patternPaths = new Array<PatternPath>();
        this._sizeRatio = null;
        this._vertices = new Set<Point>();
        this._edges = [];
        this._patternPieces = new Set<Edge[]>();
    }

    getPatternPaths = (): PatternPath[] => {
        return [...this._patternPaths];
    };

    addPatternPath = (patternPath: PatternPath): boolean => {
        const originalPatternPathslength = this._patternPaths.length;
        
        if (this._patternPaths.push(patternPath) > originalPatternPathslength) {
            return true;
        }

        return false;  
    };

    // Removes the most recently added Pattern Path.
    removePatternPath = (): boolean => {
        if (!this._patternPaths.length) {
            throw new Error("Tried to remove path from document, but there are no paths to remove");
        }
        return Boolean(this._patternPaths.pop());
    };

    arePatternPiecesEnclosed = (): boolean => {
        const endpoints: {point: Point; matched: boolean}[] = [];

        this._patternPaths.forEach(path => {
            const points = path.getPoints();
            endpoints.push({point: points[0], matched: false});
            endpoints.push({point: points[points.length - 1], matched:false});
        });

        for(let i = 0; i < endpoints.length; i++) {
            const point = endpoints[i].point;
            const matched = endpoints[i].matched;
            if (matched) {
                continue;
            }

            // Check if end point matches any other endpoint.
            for (let j = 0; j < endpoints.length && !endpoints[i].matched; j++) {
                const o = endpoints[j];

                if (o === endpoints[i]) {
                    continue;
                }

                if (point.equals(o.point)) {
                    endpoints[i].matched = true;
                    endpoints[j].matched = true;
                }
            }

            // TODO: Check if end points are on line.

            if (!endpoints[i].matched) {
                return false;
            }
        }

        return true;

    };

    isEmpty = (): boolean => {
        return !this._patternPaths.length;
    };

    // Sets the pixels per inch ratio according to the input measurement.
    setSizeRatio = (inputMeasurementInInches: number, selectedPath: PatternPath): void => {
        //console.log('selected path length: ' + selectedPath.getLengthInPixels());
        this._sizeRatio = selectedPath.getLengthInPixels() / inputMeasurementInInches;
    };

    getSizeRatio = (): number => {
        if (!this._sizeRatio) {
            console.log('error: the resizing ratio is not defined.');
            return -1;
        } 
        return this._sizeRatio;        
    };

    print = (): void => {
        this._findPatternPieces();
    };

    private _updateEdgeAndVerticesLists = (): void => {
        let i = 0;
        this._patternPaths.forEach(path => {
            i++;

            const points = path.getPoints();
            const startPoint = points[0];
            const endPoint = points[points.length - 1];

            this._vertices.add(startPoint);
            this._vertices.add(endPoint);
            
            this._edges.push({
                origin: startPoint, 
                startDirection: path.getStartDirection(), 
                destination: endPoint, 
                destinationDirection: path.getDestinationDirection(),
                pathDirectionChange: path.getPathDirectionChange(),
                path: path,
                id: i
            });
            this._edges.push({
                origin: endPoint,
                startDirection: path.getReverseStartDirection(),
                destination: startPoint,
                destinationDirection: path.getReverseDestinationDirection(),
                pathDirectionChange: path.getReversePathDirectionChange(),
                path: path,
                id: (-1 * i)
            }); 
        });
    };

    private _findPatternPieces = (): void => {
        this._updateEdgeAndVerticesLists();

        //build ordered edge lists
        const leavingEdgesMap: Map<Point, Array<Edge>> = new Map();
        this._vertices.forEach(vertex => {
            const leavingEdges: Array<Edge> = [];
            this._edges.forEach(edge => {
                if (edge.origin.equals(vertex)) {
                    leavingEdges.push(edge);
                }
            });
            leavingEdges.sort((a, b) => a.startDirection - b.startDirection);
            leavingEdgesMap.set(vertex, leavingEdges);
        });
        // console.log("leaving edges map size: " + leavingEdgesMap.size);
        leavingEdgesMap.forEach((value, key) => {
            console.log("key: " + key);
            value.forEach(element => {
                console.log("leaving edge: " + element.id);
            });
        });

        //find faces
        this._edges.forEach(edge => {
            const face: Edge[] = [];
            let current = edge;
            //console.log("current: " + current.id);
            do {
                face.push(current);
                console.log("adding edge " + current.id + " to current face" );
                const leavingEdges = leavingEdgesMap.get(current.destination);
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
                //console.log("index of next edge: " + ((index + leavingEdges.length - 1) % leavingEdges.length));
                current = leavingEdges[(index + leavingEdges.length - 1) % leavingEdges.length];
                //console.log("current: " + current.id);
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

            // TODO: if the sum of angles is (neg? pos?) the face is the outside of the graph, so addFace = false

            if (addFace) {
                this._patternPieces.add(face);
                console.log("accept face");
            } else {
                console.log("reject face");
            }
        });

        console.log(this._patternPieces.size);
    };
}