import TextObject from '../TextObject.js';

export default class Button extends TextObject {
    constructor(config) {
        super(config);

        this.y = config.y;
        this.textAlign = 'center';
        this.setClick(config.clickCallback);
        this.setHover(config.hoverCallback, config.leaveCallback);
    }

    draw() {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(this.x, this.y, this.width, this.height);

        this.context.fillStyle = this.textColor;
        this.context.textAlign = this.textAlign;
        this.context.font = `${this.fontSize}px ${this.fontFamily}`;

        const textX = this.x + this.width / 2;
        const textY = this.y + this.textHeight;

        this.context.fillText(this.text, textX, textY);
    }

    set textHeight(value) {
        // no setter
    }

    get textHeight() {
        return this.fontSize;
    }

    getClick() {
        return this.clickCallback;
    }

    setClick(clickFunc) {
        document.addEventListener('click', e => {
            if (this.isCursorOver(e.offsetX, e.offsetY)) {
                clickFunc();
            }
        });
    }

    setHover(hoverFunc, leaveFunc) {
        document.addEventListener('mousemove', e => {
            if (this.isCursorOver(e.offsetX, e.offsetY)) {
                hoverFunc();
            } else {
                leaveFunc();
            }
        });
    }
}
