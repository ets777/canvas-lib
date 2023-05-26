import {convertToUnsignedInt, convertToPositiveInt, getStringOrDefault} from './functions.js';

export default class CanvasObject {
    constructor(config) {
        this.backgroundColor = config.backgroundColor;
        this.canvasId = config.canvasId;
        this.context = config.context;
        this.height = config.height;
        this.width = config.width;
        this.x = config.x;
        this.y = config.y;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = convertToPositiveInt(value);
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = convertToPositiveInt(value);
    }

    get backgroundColor() {
        return this._backgroundColor;
    }

    set backgroundColor(value) {
        this._backgroundColor = getStringOrDefault(value, 'white');
    }

    get context() {
        return this._context;
    }

    set context(value) {
        this._context = value;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = convertToUnsignedInt(value);
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = convertToUnsignedInt(value);
    }

    get canvasId() {
        return this._canvasId;
    }

    set canvasId(value) {
        this._canvasId = getStringOrDefault(value, 'app');
    }

    draw() {
        this.drawBackground();
    }

    drawBackground() {
        if (this.backgroundColor !== 'transparent') {
            this.context.fillStyle = this.backgroundColor;
            this.context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    setCursorStyle(value) {
        document.getElementById(this.canvasId).style.cursor = value;
    }

    isCursorOver(cursorX, cursorY) {
        return cursorY > this.y &&
            cursorY < this.y + this.height &&
            cursorX > this.x &&
            cursorX < this.x + this.width;
    }
}
