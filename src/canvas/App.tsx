import { Renderer } from './Renderer';
import { Document } from './Document';
import { PathSelection } from './PathSelection';

class App {
    renderer: Renderer;
    document: Document;
    pathSelection: PathSelection;

    constructor () {
        this.document = new Document();
        this.pathSelection = new PathSelection();
        this.renderer = new Renderer(this.document, this.pathSelection);
    }
}

const AppModels = new App();
export { AppModels };
