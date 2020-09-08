import { jsPDF } from 'jspdf';
import { Document } from './Document';
import { PatternPath } from './PatternPaths/PatternPath';
import { LineSegment } from './Geometry/LineSegment';
import { Point } from './Geometry/Point';
import { BoundingBox } from './Geometry/BoundingBox';
import { Vector } from './Geometry/Vector';
import { PatternPiece } from './PatternPiece';
import { PatternPathType } from './Enums';

export class Exporter {
    doc: jsPDF | null;
    protected _documentModel: Document;
    protected _patternPieces: PatternPiece[] | null;
    protected _testPieces: PatternPiece[];

    constructor (documentModel: Document) {
        this.doc = null;
        this._documentModel = documentModel;
        this._patternPieces = [];
        
        const allowanceMapTest =  new Map<PatternPathType, number>();
        allowanceMapTest.set(3, 36.073113689422485);
        allowanceMapTest.set(2, 0);
        allowanceMapTest.set(1, 36.073113689422485);

        const testPiece = new PatternPiece([
            new PatternPath(1, [new LineSegment(new Point(114, 271), new Point(114, 152))]),
            new PatternPath(1, [new LineSegment(new Point(114, 152), new Point(229, 142))]),
            new PatternPath(1, [new LineSegment(new Point(229, 142), new Point(229, 263))]),
            new PatternPath(1, [new LineSegment(new Point(229, 263), new Point(114, 271))])
        ], allowanceMapTest);

        this._testPieces = [testPiece];
    }

    save = () => {
        this.doc = new jsPDF('p', 'pt', 'letter');
        // this._patternPieces = this._documentModel.getPatternPieces();
        console.log(this._patternPieces);
        // TODO remove or, this is for testing.
        const sizeRatio = this._documentModel.getSizeRatio() > 0 ? this._documentModel.getSizeRatio() : 2;
        console.log("size ratio:", sizeRatio);
        
        const ctx = this.doc.context2d;
        ctx.strokeStyle = '#e605c4';

        let poinstOnCanvas: Point[] = new Array<Point>();
    
        this._testPieces?.forEach(patternPiece => {

            const translationVector =  new Vector(-sizeRatio, -sizeRatio);

            patternPiece.getAllPaths().forEach(patternPath => {
                // TODO clone then scale after merging with Audrey's code
                patternPath.scale(sizeRatio);
                patternPath.translate(translationVector);
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