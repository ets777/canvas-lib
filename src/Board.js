import CanvasObject from './CanvasObject.js';

export default class Board extends CanvasObject {
    constructor(config) {
        super(config);
        
        this.blockSize = config.blockSize;
    }
}
