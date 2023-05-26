import {
    convertToBoolean,
    convertToPositiveIntOrDefault,
    getStringOrDefault,
    convertToString
} from './functions.js';
import CanvasObject from '../src/CanvasObject.js';

export default class TextObject extends CanvasObject {
    constructor(config) {
        super(config);

        this.fontDefault = config.fontDefault;
        this.fontFamily = config.fontFamily;
        this.fontSize = config.fontSize;
        this.fontUrl = config.fontUrl;
        this.fontLoaded = false;
        this.textAlign = config.textAlign;
        this.textColor = config.textColor;
        this.text = convertToString(config.text);

        if (this.fontUrl) {
            this.fontLoad();
        }
    }

    get fontDefault() {
        return this._fontDefault;
    }

    set fontDefault(value) {
        this._fontDefault = getStringOrDefault(value, 'sans-serif');
    }

    get fontFamily() {
        return this._fontFamily;
    }

    set fontFamily(value) {
        this._fontFamily = getStringOrDefault(value, this.fontDefault);
    }

    get fontSize() {
        return this._fontSize;
    }

    set fontSize(value) {
        this._fontSize = convertToPositiveIntOrDefault(value, 12);
    }

    get fontUrl() {
        return this._fontUrl;
    }

    set fontUrl(value) {
        this._fontUrl = value;
    }

    get fontLoaded() {
        return this._fontLoaded;
    }

    set fontLoaded(value) {
        this._fontLoaded = convertToBoolean(value);
    }

    get textAlign() {
        return this._textAlign;
    }

    set textAlign(value) {
        this._textAlign = getStringOrDefault(value, 'left');
    }

    get textColor() {
        return this._textColor;
    }

    set textColor(value) {
        this._textColor = getStringOrDefault(value, 'black');
    }

    fontLoad() {
        const font = new FontFace(this.fontFamily, `url(${this.fontUrl})`);
        font.load().then(
            () => {
                this.fontLoaded = true;
            },
            () => {
                this.fontLoaded = false;
                this.fontFamily = this.fontDefault;
            }
        );
    }

}
