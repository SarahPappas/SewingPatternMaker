import { jsPDF } from 'jspdf';
import { PatternPath } from './PatternPaths/PatternPath';

export class Exporter {
    doc: jsPDF;
    protected patternPieces: PatternPath[][];

    constructor (patternPieces: PatternPath[][]) {
        this.doc = new jsPDF();
        this.patternPieces = patternPieces;
        
    }

    save = () => {
        this.patternPieces.forEach(patternPiece => {
            patternPiece.forEach(patternPath => {
                // const pathStart = patternPath.get
                // this.doc.moveTo()
            });
        });

        this.doc.save("test.pdf");
    };


}