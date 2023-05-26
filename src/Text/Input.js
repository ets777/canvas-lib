import TextObject from '../TextObject.js';

export default class Input extends TextObject {
    #caretPosition;
    #previousCaretPosition;
    #isSelectionInProgress;
    #textareaFocus;
    #padding;
    #startSelectionPosition;
    #endSelectionPosition;
    #isTextSelected;
    #ctrlIsDown;
    #cycleDuration;
    #totalTime;
    #maxLength;
    #textareaCaretInterval;
    #timeShift;

    constructor(config) {
        super(config);

        this.#padding = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        };

        this.#caretPosition = 0;
        this.#cycleDuration = 2;
        this.#totalTime = 0;
        this.#maxLength = 100;
        this.#textareaCaretInterval = 100;

        this.#initEvents();
    }

    draw(cycle) {
        this.#drawBorder();
        this.drawBackground();
        this.#drawSelection();
        this.#drawText();
        this.#drawCaret();

        this.#totalTime += this.#cycleDuration;
    }

    #drawBorder() {
        this.context.beginPath();
        this.context.rect(this.x, this.y, this.width, this.height);
        this.context.stroke();
    }

    #drawText() {
        this.context.font = `${this.fontSize}px ${this.fontFamily}`;
        this.context.textAlign = this.textAlign;
        this.context.fillStyle = this.textColor;
        this.context.fillText(
            this.text,
            this.x + this.#padding.left,
            this.y + this.height - this.#padding.bottom
        );
    }

    #drawSelection() {
        if (this.#isTextSelected || this.#isSelectionInProgress) {
            let selectionX;
            let selectionWidth;
            this.context.fillStyle = 'cyan';
            if (this.#startSelectionPosition < this.#endSelectionPosition) {
                selectionX = this.context.measureText(this.text.substring(0, this.#startSelectionPosition)).width;
                selectionWidth = this.context.measureText(this.text.substring(this.#startSelectionPosition, this.#endSelectionPosition)).width;
            } else {
                selectionX = this.context.measureText(this.text.substring(0, this.#endSelectionPosition)).width;
                selectionWidth = this.context.measureText(this.text.substring(this.#endSelectionPosition, this.#startSelectionPosition)).width;
            }

            this.context.fillRect(
                this.x + this.#padding.left + selectionX,
                this.y + this.#padding.top - 3,
                selectionWidth,
                this.height - this.#padding.top - 3);
        }
    }

    #drawCaret() {
        const textWidth = this.context.measureText(this.text.substring(0, this.#caretPosition)).width;

        if (this.#caretPosition !== this.#previousCaretPosition) {
            this.#timeShift = this.#totalTime % this.#textareaCaretInterval;
        }

        if (
            this.#textareaFocus
            && (this.#totalTime - this.#timeShift) % this.#textareaCaretInterval < this.#textareaCaretInterval / 2
        ) {
            const caretX = this.x + this.#padding.left + textWidth;

            this.context.beginPath();
            this.context.lineWidth = 2;
            this.context.moveTo(caretX, this.y + 5);
            this.context.lineTo(caretX, this.y + this.height - 5);
            this.context.stroke();
        }

        this.#previousCaretPosition = this.#caretPosition;
    }

    #setCaretPosition(e) {
        const cursorX = e.offsetX;
        let textWidth = this.context.measureText(this.text).width;

        if (cursorX > textWidth + this.x + this.#padding.left) {
            this.#caretPosition = this.text.length;
            return;
        }

        for (let i = 1; i <= this.text.length; i++) {
            textWidth = this.context.measureText(this.text.substring(0, i)).width;

            if (textWidth + this.x + this.#padding.left > cursorX) {
                const prevTextWidth = this.context.measureText(this.text.substring(0, i - 1)).width;

                if (cursorX - (prevTextWidth + this.x + this.#padding.left) > textWidth + this.x + this.#padding.left - cursorX) {
                    this.#caretPosition = i;
                } else {
                    this.#caretPosition = i - 1;
                }

                return;
            }

            this.#caretPosition = i + 1;
        }
    }

    #resetSelection() {
        this.#startSelectionPosition = 0;
        this.#endSelectionPosition = 0;
        this.#isSelectionInProgress = false;
        this.#isTextSelected = false;
    }

    #deleteSelectedText() {
        if (this.#endSelectionPosition > this.#startSelectionPosition) {
            this.text = this.text.slice(0, this.#startSelectionPosition)
                + this.text.slice(this.#endSelectionPosition, this.text.length);
            this.#caretPosition = this.#startSelectionPosition;
        } else if (this.#endSelectionPosition < this.#startSelectionPosition) {
            this.text = this.text.slice(0, this.#endSelectionPosition)
                + this.text.slice(this.#startSelectionPosition, this.text.length);
            this.#caretPosition = this.#endSelectionPosition;
        }

        this.#resetSelection();
    }

    #initEvents() {
        document.addEventListener('mousedown', e => {
            this.#isSelectionInProgress = this.isCursorOver(e.offsetX, e.offsetY);
            this.#setCaretPosition(e);
            this.#startSelectionPosition = this.#caretPosition;
            this.#endSelectionPosition = this.#caretPosition;
        });

        document.addEventListener('mousemove', e => {
            this.setCursorStyle('text');
            if (this.#isSelectionInProgress && this.isCursorOver(e.offsetX, e.offsetY)) {
                this.#setCaretPosition(e);
                this.#endSelectionPosition = this.#caretPosition;

                this.#isTextSelected = true;
            }
        });

        document.addEventListener('mouseup', e => {
            this.#textareaFocus = this.isCursorOver(e.offsetX, e.offsetY) || this.#isSelectionInProgress;

            // document.getElementById('input').focus();

            this.#isSelectionInProgress = false;
        });

        document.addEventListener('click', e => {
            if (this.#textareaFocus) {
                this.#setCaretPosition(e);
            }

            if (this.#endSelectionPosition == this.#startSelectionPosition) {
                this.#resetSelection();
            }

        });

        // mobile keyboard
        document.addEventListener('input', e => {

            if (this.#textareaFocus && e.data && (this.text.length < this.#maxLength || this.#isTextSelected)) {

                if (this.#isTextSelected) {
                    this.#deleteSelectedText();
                }

                this.text = this.text.slice(0, this.#caretPosition) + e.data + this.text.slice(this.#caretPosition, this.text.length);
                this.#caretPosition++;
            }
        });

        // pc keyboard
        document.addEventListener('keypress', e => {

            console.log(this.#maxLength);

            if (
                this.#textareaFocus
                && e.key != 'Enter'
                && e.key != 'Delete'
                && (this.text.length < this.#maxLength || this.#isTextSelected)
            ) {

                if (this.#isTextSelected) {
                    this.#deleteSelectedText();
                }

                this.text = this.text.slice(0, this.#caretPosition) + e.key + this.text.slice(this.#caretPosition, this.text.length);
                this.#caretPosition++;
            }
        });

        document.addEventListener('keydown', e => {
            if (this.#isTextSelected && ['Delete', 'Backspace'].includes(e.key)) {
                this.#deleteSelectedText();
            } else {
                if (e.key == 'Backspace') {
                    this.text = this.text.slice(0, this.#caretPosition - +(this.#caretPosition > 0)) + this.text.slice(this.#caretPosition, this.text.length);
                    this.#caretPosition -= +(this.#caretPosition > 0);
                }

                if (e.key == 'Delete') {
                    this.text = this.text.slice(0, this.#caretPosition) + this.text.slice(this.#caretPosition + 1, this.text.length);
                }
            }

            if (e.key == 'ArrowLeft' && !this.#ctrlIsDown) {
                this.#caretPosition -= +(this.#caretPosition > 0);
                this.#resetSelection();
            }

            if (e.key == 'ArrowRight' && !this.#ctrlIsDown) {
                this.#caretPosition += +(this.#caretPosition < this.text.length);
                this.#resetSelection();
            }

            if (['ArrowLeft', 'ArrowRight'].includes(e.key) && this.#ctrlIsDown) {
                let wordsPosition = [...this.text.matchAll(/\s+/g)];
                wordsPosition = wordsPosition.map(a => a.index + a[0].length);

                if (e.key == 'ArrowLeft') {
                    wordsPosition = wordsPosition.filter(a => a < this.#caretPosition);
                    this.#caretPosition = wordsPosition[wordsPosition.length - 1] || 0;
                } else {
                    wordsPosition = wordsPosition.filter(a => a > this.#caretPosition);
                    this.#caretPosition = wordsPosition[0] || this.text.length;
                }
            }

            if (e.key == 'Control') {
                this.#ctrlIsDown = true;
            }

            if ((e.key == 'c' || e.key == 'с') && this.#ctrlIsDown && this.#isTextSelected) {
                if (this.#startSelectionPosition > this.#endSelectionPosition) {
                    navigator.clipboard.writeText(this.text.slice(this.#endSelectionPosition, this.#startSelectionPosition));
                } else {
                    navigator.clipboard.writeText(this.text.slice(this.#startSelectionPosition, this.#endSelectionPosition));
                }
            }

            if ((e.key == 'x' || e.key == 'ч') && this.#ctrlIsDown && this.#isTextSelected) {
                navigator.clipboard.writeText(this.text.slice(this.#startSelectionPosition, this.#endSelectionPosition));

                this.#deleteSelectedText();
            }

            if ((e.key == 'v' || e.key == 'м') && this.#ctrlIsDown) {
                navigator.clipboard.readText().then(clipboardText => {
                    if (clipboardText.length > 0) {
                        console.log(this.#caretPosition);
                        this.#deleteSelectedText();

                        console.log(this.#caretPosition);

                        this.text = this.text.slice(0, this.#caretPosition)
                            + clipboardText
                            + this.text.slice(this.#caretPosition, this.text.length);

                        if (this.text.length > this.#maxLength) {
                            this.text = this.text.slice(0, this.#maxLength);
                        }

                        this.#caretPosition += clipboardText.length;
                    }
                });
            }

            if ((e.key == 'a' || e.key == 'ф') && this.#ctrlIsDown) {
                this.#isTextSelected = true;
                this.#startSelectionPosition = 0;
                this.#endSelectionPosition = this.text.length;
                this.#caretPosition = this.text.length;
            }
        });

        document.addEventListener('keyup', e => {
            if (e.key == 'Control') {
                this.#ctrlIsDown = false;
            }
        });
    }
}
