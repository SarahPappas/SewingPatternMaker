import { Renderer } from './Renderer';
import { Document } from './Document';
import { PathSelection } from './PathSelection';
import { Exporter } from './Exporter';

class AppController {
    renderer: Renderer;
    document: Document;
    pathSelection: PathSelection;
    exporter: Exporter;

    constructor () {
        this.document = new Document();
        this.pathSelection = new PathSelection();
        this.renderer = new Renderer(this.document, this.pathSelection);
        this.exporter = new Exporter();
    }
}

const App = new AppController();
export { App };
