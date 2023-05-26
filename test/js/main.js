import App from '../../src/App.js';
import Text from '../../src/Text/Text.js';
import Input from '../../src/Text/Input.js';
import Board from '../../src/Board.js';
import Button from '../../src/Button/Button.js';

const config = {
    width: 600,
    height: 600
}
const app = new App(config);
const { context } = app;

const textParams = {
    context,
    text: 'Hello World!',
    fontSize: 24,
    textColor: 'white',
    backgroundColor: 'blue'
};

const text = new Text(textParams);

const boardParams = {
    context,
    y: text.height,
    width: app.width,
    height: app.height - text.height,
    blockSize: 50,
    backgroundColor: '#ddf'
};

const board = new Board(boardParams);

const buttonPlusParams = {
    context,
    x: app.width / 2,
    width: 100,
    height: 50,
    fontSize: 36,
    backgroundColor: 'blue',
    textColor: 'white',
    text: '+',
    clickCallback: () => { text.fontSize += 10 },
    hoverCallback: () => { buttonPlus.backgroundColor = 'red' },
    leaveCallback: () => { buttonPlus.backgroundColor = 'blue' }
}

const buttonPlus = new Button(buttonPlusParams);

const buttonMinusParams = {
    context,
    x: app.width / 2 + 110,
    width: 100,
    height: 50,
    fontSize: 36,
    backgroundColor: 'blue',
    textColor: 'white',
    text: '-',
    clickCallback: () => { text.fontSize -= 10 },
    hoverCallback: () => { buttonMinus.backgroundColor = 'red' },
    leaveCallback: () => { buttonMinus.backgroundColor = 'blue' }
}

const buttonMinus = new Button(buttonMinusParams);

const inputParams = {
    context,
    x: 10,
    y: 50,
    width: 200,
    height: 50,
    fontSize: 36
};

const input = new Input(inputParams);

const buttonNumberParams = {
    context,
    x: 10,
    y: 100,
    width: 50,
    height: 50,
    fontSize: 36,
    backgroundColor: 'blue',
    textColor: 'white',
    text: '1',
    clickCallback: () => { input.text += buttonNumber.text },
    hoverCallback: () => { buttonNumber.backgroundColor = 'red' },
    leaveCallback: () => { buttonNumber.backgroundColor = 'blue' }
}

const buttonNumber = new Button(buttonNumberParams);

app.addElement(board);
app.addElement(text);
app.addElement(buttonPlus);
app.addElement(buttonMinus);
app.addElement(input);
app.addElement(buttonNumber);

const appCycle = () => {
    app.clearCanvas();
    app.drawElements();
}

app.start(appCycle);