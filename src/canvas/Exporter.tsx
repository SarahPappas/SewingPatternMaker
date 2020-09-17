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
    protected _testPiecesRect: PatternPiece[];
    protected _testPiecesBig: PatternPiece[];

    constructor (documentModel: Document) {
        this.doc = null;
        this._documentModel = documentModel;
        this._patternPieces = [];
        
        const allowanceMapTestRect =  new Map<PatternPathType, number>();
        allowanceMapTestRect.set(3, 36.073113689422485);
        allowanceMapTestRect.set(2, 0);
        allowanceMapTestRect.set(1, 36.073113689422485);

        let testPiece = new PatternPiece([
            new PatternPath(1, [new LineSegment(new Point(114, 271), new Point(114, 152))]),
            new PatternPath(1, [new LineSegment(new Point(114, 152), new Point(229, 142))]),
            new PatternPath(1, [new LineSegment(new Point(229, 142), new Point(229, 263))]),
            new PatternPath(1, [new LineSegment(new Point(229, 263), new Point(114, 271))])
        ], allowanceMapTestRect);

        this._testPiecesRect = [testPiece];

        const allowanceMapTestBig =  new Map<PatternPathType, number>();
        allowanceMapTestBig.set(3, 6.871842709362768);
        allowanceMapTestBig.set(2, 0);
        allowanceMapTestBig.set(1, 6.871842709362768);
        testPiece = new PatternPiece([
            new PatternPath(1, [new LineSegment(new Point(95, 326), new Point(142, 172))]),
            new PatternPath(1, [new LineSegment(new Point(142, 172), new Point(223, 222))]),
            new PatternPath(1, [new LineSegment(new Point(223, 222), new Point(95, 326))]),
        ], allowanceMapTestBig);
        this._testPiecesBig = [testPiece];
    }

    save = (): void => {
        this.doc = new jsPDF('p', 'in', 'letter');
        // Delete the first page, which is automatically added when a new jsPDF is created.
        this.doc.deletePage(1);

        // TODO add margins marginTop: .75, marginBottom: .75, marginLeft: .75, marginRight:.75
        this._patternPieces = this._documentModel.getPatternPieces();
        
        // TODO remove, this is for testing.
        let patternPieces = this._patternPieces;
        if (!patternPieces?.length) {
            patternPieces = this._testPiecesBig;
        }

        console.log("pattern pieces:", this._patternPieces);

        // Set page lenght, width and DPI
        const DPI = 300;
        const pageWidth = 8.5;
        const pageHeight = 11;
        const pageSizeX = pageWidth * DPI;
        const pageSizeY = pageHeight * DPI;
        const epsilon = .1;

        /* 
        * Create a canvas, which we will draw to. Then we will turn that canvas into a png 
        * and add it to the pdf.
        */
        const canvas = this._createCanvas(DPI, pageWidth, pageHeight);
        const ctx = canvas.getContext('2d');

        // Calculate ratio to scale by.
        const pixelsPerInch = this._documentModel.getSizeRatio() > 0 ? this._documentModel.getSizeRatio() : 6.871842709362768;
        const inchesPerPixel = 1 / pixelsPerInch * DPI;
 
        patternPieces?.forEach(patternPiece => {
            // TODO adjust length of lines before they are clipped.
            // Clone original piece and scale.
            const originalPatternPiece = patternPiece.clone();
            this._scale(originalPatternPiece, inchesPerPixel);

            // Calculate the number of pages in a row and in a column
            const boundBox = originalPatternPiece.getBoundingBox();
            const numPagesX = Math.ceil(boundBox.width / pageSizeX);
            const numPagesY = Math.ceil(boundBox.height / pageSizeY);
            
            let positionX = 0;
            let positionY = 0;
            for (let x = 0; x < numPagesX; x++) {
                positionX = x * pageSizeX;
            
                for (let y = 0; y < numPagesY; y++) {
                    positionY = y * pageSizeY;
                    this.doc?.addPage();
                    console.log("page num ", this.doc?.getNumberOfPages());

                    if (!ctx) {
                        throw new Error("Could not create 2D context for canvas.");
                    }

                    ctx.clearRect(0, 0, pageSizeX, pageSizeY);

                    // Draw white background
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, pageSizeX, pageSizeY);

                    // Push a clip rect.
                    ctx.save();
                    ctx.rect(epsilon, epsilon, pageSizeX - epsilon, pageSizeY - epsilon);
                    ctx.clip();
                    
                    // Translate the piece, so that the correct section is drawn in the clip rect.
                    const translatedPatternPiece = originalPatternPiece.clone();
                    translatedPatternPiece.translate(new Vector(-positionX + epsilon, -positionY  + epsilon));

                    translatedPatternPiece.getAllPaths().forEach(patternPath => {
                        ctx.stroke(patternPath.getPath2D());
                    });
            
                    // Pop the clip rect.
                    ctx.restore();

                    // Create an image from the canvas and add it to the pdf.
                    // Use JPEG intead of PNG because the JSPDF PNG encoder is slow and creates large documents.
                    this.doc?.addImage(canvas, 'JPEG', 0, 0, pageWidth, pageHeight);
                    this._printFooter();
                }
            }
        });
        
        this.doc.save("test.pdf");
    };

    private _scale = (patternPiece: PatternPiece, scalar: number): void => {
        patternPiece.scale(scalar);

        const boundBox = patternPiece.getBoundingBox();
        patternPiece.translate(new Vector(-boundBox.minX, -boundBox.minY));
    };

    private _printFooter = (): void => {
        this.doc?.text('page ' + this.doc?.getCurrentPageInfo().pageNumber, 1, 10.5);
    };

    private _createCanvas = (dpi: number, pageWidth: number, pageHeight: number): HTMLCanvasElement => {
        const canvas = document.createElement('canvas');
        // TODO remove adding canvas to html for testing.
        document.body.appendChild(canvas);
        canvas.width = dpi  * pageWidth;
        canvas.height = dpi * pageHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error("Could not create 2D context for canvas.");
        }

        ctx.lineWidth = 1/16 * dpi;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#e605c4';

        return canvas;
    }
}