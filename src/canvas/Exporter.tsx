import { jsPDF } from 'jspdf';
import { Document } from './Document';
import { Vector } from './Geometry/Vector';
import { PatternPiece } from './PatternPiece';
import { PDFName } from 'canvas/Enums';


export class Exporter {
    doc: jsPDF | null;
    protected _documentModel: Document;

    constructor (documentModel: Document) {
        this.doc = null;
        this._documentModel = documentModel;
    }

    savePDF = (): void => {
        if (!this.doc) {
            this._createPDF();
        }

        this.doc?.save(PDFName.name);
    };

    getPDF = (): Blob => {
        if (!this.doc) {
            this._createPDF();
        }
    
        return this.doc?.output('blob') || new Blob([]);
    };

    _createPDF = (): void => {
        this.doc = new jsPDF('p', 'in', 'letter');
        // Delete the first page, which is automatically added when a new jsPDF is created.
        this.doc.deletePage(1);

        const patternPieces = this._documentModel.getPatternPieces();

        // Set page height, width and DPI
        const DPI = 300;
        const pageWidth = 8.5;
        const pageHeight = 11;
        const margin = .5;
        const innerPageWidth = pageWidth - (2 * margin);
        const innerPageHeight = pageHeight - (2 * margin);
        const pageSizeX = innerPageWidth * DPI;
        const pageSizeY = innerPageHeight * DPI;

        /* 
        * Create a canvas, which we will draw to. Then we will turn that canvas into a png 
        * and add it to the pdf.
        */
        const canvas = this._createCanvas(DPI, innerPageWidth, innerPageHeight);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error("Could not create 2D context for canvas.");
        }

        // Calculate ratio to scale by.
        const pixelsPerInch = this._documentModel.getSizeRatio();
        const inchesPerPixel = 1 / pixelsPerInch;
        const dotsPerPixel = inchesPerPixel * DPI;
 
        let pieceNum = 0;
        patternPieces?.forEach(patternPiece => {
            pieceNum++;
            // Clone original piece and scale.
            const originalPatternPiece = patternPiece.clone();
            this._scaleAndRealign(originalPatternPiece, dotsPerPixel);

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
                    ctx.clearRect(0, 0, pageSizeX, pageSizeY);

                    // Draw white background and border
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, pageSizeX, pageSizeY);
                    ctx.strokeRect(0, 0, pageSizeX, pageSizeY);

                    // Push a clip rect. The clipping rect will ensure that we only display
                    // the section of the canvas within the clip rect.
                    ctx.save();
                    ctx.rect(0, 0, pageSizeX, pageSizeY);
                    ctx.clip();
                    
                    // Translate the piece, so that the correct section is drawn in the clip rect.
                    const translatedPatternPiece = originalPatternPiece.clone();
                    translatedPatternPiece.translate(new Vector(-positionX, -positionY));

                    translatedPatternPiece.getAllPaths().forEach(patternPath => {
                        ctx.stroke(patternPath.getPath2D());
                    });
            
                    // Pop the clip rect.
                    ctx.restore();

                    // Create an image from the canvas and add it to the pdf.
                    // Use JPEG intead of PNG because the JSPDF PNG encoder is slow and creates large documents.
                    this.doc?.addImage(canvas, 'JPEG', margin, margin, innerPageWidth, innerPageHeight);
                    this._printFooter(x + 1, y + 1, pieceNum);
                }
            }
        });
    };

    private _scaleAndRealign = (patternPiece: PatternPiece, scalar: number): void => {
        patternPiece.scale(scalar);

        const boundBox = patternPiece.getBoundingBox();
        patternPiece.translate(new Vector(-boundBox.minX, -boundBox.minY));
    };

    private _printFooter = (x: number, y: number, pieceNum: number): void => {
        this.doc?.text('Piece ' + pieceNum + ', page (' + x + ', ' + y +')', .6, 10.35);
    };

    private _createCanvas = (dpi: number, pageWidth: number, pageHeight: number): HTMLCanvasElement => {
        const canvas = document.createElement('canvas');
        canvas.width = dpi  * pageWidth;
        canvas.height = dpi * pageHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error("Could not create 2D context for canvas.");
        }

        ctx.lineWidth = 1/16 * dpi;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';

        return canvas;
    };
}