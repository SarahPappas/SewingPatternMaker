import { jsPDF } from 'jspdf';

export class Exporter {
    doc: jsPDF;

    constructor () {
        this.doc = new jsPDF();
        this.doc.text("Hello world!", 10, 10);
    }

    save = () => {
        this.doc.save("test.pdf");
    };
}