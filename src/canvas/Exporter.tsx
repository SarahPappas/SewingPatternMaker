import { jsPDF } from 'jspdf';
import { Document } from './Document';
import { PatternPath } from './PatternPaths/PatternPath';
import { LineSegment } from './Geometry/LineSegment';
import { Point } from './Geometry/Point';
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

    save = (): void => {
        this.doc = new jsPDF('p', 'in', 'letter');
        this.doc.setLineWidth(1/16);
        this._patternPieces = this._documentModel.getPatternPieces();
        let patternPieces = this._patternPieces;
        if (!patternPieces?.length) {
            patternPieces = this._testPieces;
        }
        console.log("pattern pieces:", this._patternPieces);
        // TODO remove or, this is for testing.
        // TODO rename size ratio.
        // TODO fix scaler to scalar
        const pixelsPerInch = this._documentModel.getSizeRatio() > 0 ? this._documentModel.getSizeRatio() : 36;
        const inchesPerPixel = 1 / pixelsPerInch;
        console.log("pixelsPerInch", pixelsPerInch);

        const ctx = this.doc.context2d;
        ctx.lineWidth = 1/16;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#e605c4';

        let poinstOnCanvas: Point[] = new Array<Point>();
        patternPieces?.forEach(patternPiece => {
            // TODO: Add Page and clip for each peach
            // this.doc?.addPage();
            patternPiece = patternPiece.clone();
            this._transform(patternPiece, inchesPerPixel);

            patternPiece.getAllPaths().forEach(patternPath => {
                console.log(patternPath.getType);
                const pathStart = patternPath.getStart();
                ctx.beginPath();
                ctx.moveTo(pathStart.x, pathStart.y);
                patternPath.draw(ctx);

                ctx.stroke();

                poinstOnCanvas = poinstOnCanvas.concat(patternPath.getPoints());
             });
        });

        this.doc.save("test.pdf");
    };

    private _transform = (patternPiece: PatternPiece, inchesPerPixel: number): void => {
        patternPiece.scale(inchesPerPixel);

        const boundBox = patternPiece.getBoundingBox();
        patternPiece.translate(new Vector(-boundBox.minX, -boundBox.minY));
    };
}