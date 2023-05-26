import TextObject from '../TextObject.js';

export default class Text extends TextObject {
    constructor(config) {
        super(config);
    }

    draw() {
        this.context.font = `${this.fontSize}px ${this.fontFamily}`;
        this.drawBackground();
        
        this.context.textAlign = this.textAlign;
        this.context.fillStyle = this.textColor;
        this.context.fillText(this.text, this.x, this.y + this.height * .9);
    }

    get width() {
        return Math.ceil(this.context.measureText(this.text).width);
    }

    set width(value) {
        // no setter
    }

    get height() {
        return this.fontSize;
    }

    set height(value) {
        // no setter
    }
}
