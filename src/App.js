import CanvasObject from './CanvasObject.js';
import Button from './Button/Button.js';
import Input from './Text/Input.js';
import { convertToPositiveIntOrDefault, getStringOrDefault } from './functions.js';

export default class App extends CanvasObject {
    constructor(config) {
        super(config);

        this.period = config.period;
        this.elements = [];
        this.time = {
            cycleNumber: 0,
            cycleLength: this.period,
            time: 0,
            realTime: performance.now(),
        };
        this.initContext();
    }

    initContext() {
        const app = document.getElementById(this.canvasId);
        app.width = this.width;
        app.height = this.height;
        this.context = app.getContext('2d');
    }

    clearCanvas() {
        this.drawBackground();
    }

    runCycle(cycleFunction) {

    }

    start(cycleFunction) {

        const time = this.time;

        setInterval(function () {

            time.cycleNumber++;
            time.time += time.cycleLength;
            time.realTime = performance.now();

            // console.log(time);

            cycleFunction();
        }, this.time.cycleLength);
        this.setCursorHandler();
    }

    get period() {
        return this._period;
    }

    set period(value) {
        this._period = convertToPositiveIntOrDefault(value, 20);
    }

    get elements() {
        return this._elements || [];
    }

    set elements(value) {
        this._elements = value;
    }

    addElement(element) {
        this.elements.push(element);
    }

    drawElements() {
        this.elements.forEach(element => {
            element.draw();
        });
    }

    setCursorHandler() {
        const buttons = this.elements.filter(element => element instanceof Button);
        const inputs = this.elements.filter(element => element instanceof Input);

        document.addEventListener('mousemove', e => {
            const isCursorOverButton = button => button.isCursorOver(e.offsetX, e.offsetY);
            const isCursorOverInput = input => input.isCursorOver(e.offsetX, e.offsetY);

            if (buttons.find(isCursorOverButton)) {
                this.setCursorStyle('pointer');
            } else if (inputs.find(isCursorOverInput)) {
                this.setCursorStyle('text');
            } else {
                this.setCursorStyle('default');
            }
        });
    }
}
