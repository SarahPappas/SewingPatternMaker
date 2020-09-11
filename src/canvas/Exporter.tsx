import { jsPDF } from 'jspdf';
import { Document } from './Document';
import { PatternPath } from './PatternPaths/PatternPath';
import { LineSegment } from './Geometry/LineSegment';
import { Point } from './Geometry/Point';
import { Vector } from './Geometry/Vector';
import { PatternPiece } from './PatternPiece';
import { PatternPathType } from './Enums';
import { BezierCurve } from './Geometry/BezierCurve';
import { BoundingBox } from './Geometry/BoundingBox';

export class Exporter {
    doc: jsPDF | null;
    protected _documentModel: Document;
    protected _patternPieces: PatternPiece[] | null;
    protected _testPiecesRect: PatternPiece[];
    protected _testPiecesBig: PatternPiece[];

    constructor (documentModel: Document) {
        this.doc = null;
        this._documentModel = documentModel;
        this._patternPieces = [];
        
        const allowanceMapTest =  new Map<PatternPathType, number>();
        allowanceMapTest.set(3, 36.073113689422485);
        allowanceMapTest.set(2, 0);
        allowanceMapTest.set(1, 36.073113689422485);

        let testPiece = new PatternPiece([
            new PatternPath(1, [new LineSegment(new Point(114, 271), new Point(114, 152))]),
            new PatternPath(1, [new LineSegment(new Point(114, 152), new Point(229, 142))]),
            new PatternPath(1, [new LineSegment(new Point(229, 142), new Point(229, 263))]),
            new PatternPath(1, [new LineSegment(new Point(229, 263), new Point(114, 271))])
        ], allowanceMapTest);

        this._testPiecesRect = [testPiece];

        allowanceMapTest.set(3, 6.871842709362768);
        allowanceMapTest.set(1, 6.871842709362768);
        testPiece = new PatternPiece([
            new PatternPath(1, [new LineSegment(new Point(95, 326), new Point(142, 172))]),
            new PatternPath(1, [new LineSegment(new Point(142, 172), new Point(223, 222))]),
            new PatternPath(1, [new LineSegment(new Point(223, 222), new Point(95, 326))]),
        ], allowanceMapTest);
        this._testPiecesBig = [testPiece];
    }

    save = (): void => {
        this.doc = new jsPDF('p', 'in', 'letter');
        //marginTop: .75, marginBottom: .75, marginLeft: .75, marginRight:.75
        this._patternPieces = this._documentModel.getPatternPieces();
        let patternPieces = this._patternPieces;
        if (!patternPieces?.length) {
            patternPieces = this._testPiecesRect;
        }
        console.log("pattern pieces:", this._patternPieces);
        // TODO remove or, this is for testing.
        const pixelsPerInch = this._documentModel.getSizeRatio() > 0 ? this._documentModel.getSizeRatio() : 6.871842709362768;
        const inchesPerPixel = 1 / pixelsPerInch;
        console.log("pixelsPerInch", pixelsPerInch);

        // context settings
        const ctx = this.doc.context2d;
        ctx.lineWidth = 1/16;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        // ctx.pageWrapXEnabled = false;
        // ctx.pageWrapYEnabled = true;
        ctx.autoPaging = false;    
        ctx.strokeStyle = '#e605c4';
        const numPages = this.doc.getNumberOfPages();

        patternPieces?.forEach(patternPiece => {
            // TODO: Add Page and clip for each peach
            patternPiece = patternPiece.clone();
            this._transform(patternPiece, inchesPerPixel);

            // patternPiece.getAllPaths().forEach(patternPath => {
            //     console.log(patternPath.getType);
            //     const pathStart = patternPath.getStart();
            //     ctx.beginPath();
            //     ctx.moveTo(pathStart.x, pathStart.y);
            //     patternPath.draw(ctx);
            //     ctx.stroke();
            // });

            let positionX = 0;
            let positionY = 0;
            const boundBox = patternPiece.getBoundingBox();
            let pageNum = 1;
            for (let i = 0; i < Math.ceil(boundBox.maxY/11); i++) {
                positionY += 11;
                for (let j = 0; j < Math.ceil(boundBox.maxX/8.5); j++) {
                    positionX += 8.5
                    if (pageNum == 1) {
                        this.doc?.setPage(1)
                    } else {
                        this.doc?.addPage();
                    }

                    ctx.save();
                    ctx.rect(0, 0, 8.49, 10.9);
                    ctx.clip();
    
                    patternPiece.getAllPaths().forEach(patternPath => {
                        console.log(patternPath.getType);
                        const pathStart = patternPath.getStart();
                        ctx.beginPath();
                        ctx.moveTo(pathStart.x, pathStart.y);
                        patternPath.draw(ctx);
                        ctx.stroke();
                    });

                    ctx.restore();
                    patternPiece.translate(new Vector(-positionX, -positionY));
                }
            }
        });
        
        this.doc.save("test.pdf");
    };

    private _transform = (patternPiece: PatternPiece, inchesPerPixel: number): void => {
        patternPiece.scale(inchesPerPixel);

        const boundBox = patternPiece.getBoundingBox();
        patternPiece.translate(new Vector(-boundBox.minX, -boundBox.minY));
    };
}