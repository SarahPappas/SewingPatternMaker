import { jsPDF } from 'jspdf';

export class Exporter {
    doc: jsPDF;

    constructor () {
        this.doc = new jsPDF();
        this.doc.text("Hello world!", 10, 10);
        this.doc.save("a4.pdf");
    }

    save = () => {
        this.doc.save("test.pdf");
    };
}