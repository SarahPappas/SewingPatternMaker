import { jsPDF } from 'jspdf';
import { Document } from './Document';
import { PatternPath } from './PatternPaths/PatternPath';

export class Exporter {
    doc: jsPDF;
    protected _documentModel: Document;
    protected _patternPieces: PatternPath[][];

    constructor (documentModel: Document) {
        this.doc = new jsPDF('p', 'pt', 'letter');
        this._documentModel = documentModel;
        this._patternPieces = [];
    }

    save = () => {
        this._patternPieces = this._documentModel.getPatternPieces();
        const ctx = this.doc.context2d;
        ctx.strokeStyle = '#e605c4';
        this._patternPieces.forEach(patternPiece => {
            patternPiece.forEach(patternPath => {
                const pathStart = patternPath.getStart();
                ctx.moveTo(pathStart.x, pathStart.y);
                const segments = patternPath.getSegments();
                segments.forEach(segment => {
                    segment.drawTo(ctx);
                });
             });
        });

        ctx.stroke();

        this.doc.save("test.pdf");
    };
}