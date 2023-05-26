import Button from 'Button.js';

export default class RoundButton extends Button {
    constructor(config) {
        super(config);
    }

    draw() {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(this.x, this.y - this.height, this.width, this.height);

        this.context.fillStyle = this.textColor;
        this.context.textAlign = this.textAlign;
        this.context.font = `${this.fontSize}px ${this.fontFamily}`;

        const textX = this.x + this.width / 2;
        const textY = this.y - this.height / 2 + this.getTextHeight() / 3;

        this.context.fillText(this.text, textX, textY);
    }

    isCursorOverButton(cursorX, cursorY) {
        return cursorY > this.y - this.height &&
            cursorY < this.y &&
            cursorX > this.x &&
            cursorX < this.x + this.width;
    }

    getTextHeight() {
        return this.fontSize;
    }
}
