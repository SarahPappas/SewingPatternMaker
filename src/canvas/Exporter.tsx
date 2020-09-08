import { jsPDF } from 'jspdf';
import { Document } from './Document';
import { PatternPath } from './PatternPaths/PatternPath';
import { LineSegment } from './Geometry/LineSegment';
import { Point } from './Geometry/Point';
import { BoundingBox } from './Geometry/BoundingBox';

export class Exporter {
    doc: jsPDF | null;
    protected _documentModel: Document;
    protected _patternPieces: PatternPath[][];
    protected _testPieces: PatternPath[][];

    constructor (documentModel: Document) {
        this.doc = null;
        this._documentModel = documentModel;
        this._patternPieces = [];
        this._testPieces = [[
            new PatternPath(1, [new LineSegment(new Point(66, 189), new Point(66, 293))]),
            new PatternPath(1, [new LineSegment(new Point(66, 189), new Point(157, 189))]),
            new PatternPath(1, [new LineSegment(new Point(157, 189), new Point(155, 287))]),
            new PatternPath(1, [new LineSegment(new Point(66, 293), new Point(155, 287))])
        ]];
    }

    save = () => {
        this.doc = new jsPDF('p', 'pt', 'letter');
        // this._patternPieces = this._documentModel.getPatternPieces();
        console.log(this._patternPieces);
        // TODO remove or, this is for testing.
        const sizeRatio = this._documentModel.getSizeRatio() > 0 ? this._documentModel.getSizeRatio() : 4;
        console.log("size ratio:", sizeRatio);
        const ctx = this.doc.context2d;
        ctx.strokeStyle = '#e605c4';

        let poinstOnCanvas: Point[] = new Array<Point> ();
        this._testPieces.forEach(patternPiece => {
            patternPiece.forEach(patternPath => {
                // TODO clone then scale after merging with Audrey's code
                patternPath.scale(sizeRatio);
                // TODO translate after merging with Audrey's code
                const pathStart = patternPath.getStart();
                ctx.beginPath();
                ctx.moveTo(pathStart.x, pathStart.y);
                patternPath.draw(ctx);
                ctx.stroke();

                poinstOnCanvas = poinstOnCanvas.concat(patternPath.getPoints());
             });
        });

        const boundBox = new BoundingBox(poinstOnCanvas);
        
        // TODO use cliping to add pages.


        this.doc.save("test.pdf");
    };
}