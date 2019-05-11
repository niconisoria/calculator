//FUNC DEFINITION

//OPERATIONS
function add(firstNum, secondNum){
    return Math.round((firstNum + secondNum) * 100) / 100;
}

function substrac(firstNum, secondNum){
    return Math.round((firstNum - secondNum) * 100) / 100;
}

function multiply(firstNum, secondNum){
    return Math.round(firstNum * secondNum * 100) / 100;
}

function divide(firstNum, secondNum){
    return secondNum != 0 ? Math.round(firstNum / secondNum * 100) / 100 : 'Zero division.';
}

//PRINCIPAL FUNCTION
function operate(firstNum, secondNum, operator){
    switch (operator) {
        case '+':
            return add(firstNum, secondNum);
        case '-':
            return substrac(firstNum, secondNum);
        case '*':
            return multiply(firstNum, secondNum);
        case '/':
            return divide(firstNum, secondNum);
        default:
            break;
    }
}

function reduceOperation(op1, op2){
    while (operationStore.some(element => element == op1 || element == op2)){
        operationStore.map((element, index, array) => {
            if(element == op1 || element == op2){
                array.splice(index-1, 3, operate(array[index-1], array[index+1], element));
            }
        });
    }
}

function checkZeroDivision(){
    if(operationStore.some(element => element == 'Zero division.')) operationStore = ['Zero division.'];
}

function keyPressed(){
    if(displayStore == '0' || operationStore.length == 1) {
        operationFinished = false;
        operationStore = [];
        displayStore = this.textContent;
        displayPartialStore = this.textContent;
    } else {
        displayStore += this.textContent;
        displayPartialStore += this.textContent;
    }
    populateDisplay();
}

function operationPressed(){
    if(displayStore.match(/[/*+-]*$/g) == "" && displayStore != '0' && displayStore != 'Zero division.') { //If there is no operators at the end
        addParcialStore();
        operationStore.push(this.id);
        displayStore += this.id;
        displayPartialStore = '';
        populateDisplay();
    }
}

function addParcialStore(){
    if(displayPartialStore != '') operationStore.push(parseFloat(displayPartialStore));
}

function equals(){
    if(displayStore.match(/[/*+-]*$/g) == "" && displayStore != '0'){ 
        addParcialStore();
        reduceOperation('/','*');
        checkZeroDivision();
        reduceOperation('+','-');
        displayStore = operationStore.toString();
        displayPartialStore = '';
        populateDisplay();
    }
}

function clearScreen(){
    displayStore = '0';
    displayPartialStore = '';
    operationStore = [];
    populateDisplay();
}

function populateDisplay(){
    display.textContent = displayStore;
}

function commaPressed(){
    if(displayPartialStore.match(/[.]/gi) == null){//If there is no a comma already
        displayStore += this.textContent;
        displayPartialStore += this.id;
        populateDisplay();
    }    
}

function deleteOperationStore(){ //Delete the last character from the operationStore
    let lastElement = operationStore.pop().toString();
    if(lastElement.length != 1){
        operationStore.push(parseFloat(lastElement.substring(0, lastElement.length-1)));
    }
}

function deletePressed(){
    addParcialStore(); //Add the last number on the display
    displayPartialStore = ''; //Clear the displayStore
    if(displayStore.length == 1 || displayStore == 'Zero division.'){
        displayStore = '0';
        displayPartialStore = '';
        operationStore.pop();
    } else{
        displayPartialStore = displayPartialStore.substring(0, displayPartialStore.length-1);
        displayStore = displayStore.substring(0, displayStore.length-1);
        deleteOperationStore();
    }
    populateDisplay();
}

function negatePressed(){
    let lastElement = operationStore[operationStore.length - 1];
    if(displayPartialStore == ''){
        return;
    }
    if(lastElement == '+'){
        changeOperation('-');
    }
    if(lastElement == '-'){
        changeOperation('+');
    }
    if(lastElement == '/' || lastElement == '*'){
        console.log(displayPartialStore);
        displayPartialStore = (-parseFloat(displayPartialStore)).toString();
        displayStore = displayStore.replace(/([0-9]|[-]+[0-9])+$/g, displayPartialStore);
    }
    if(displayStore.length >= 1 && displayStore.length <= 2 && displayStore != '0'){
        displayPartialStore = (-parseFloat(displayPartialStore)).toString();
        displayStore = displayPartialStore;
    }
    populateDisplay();
}

function changeOperation(to){
    operationStore.pop();
    operationStore.push(to);
    displayStore = displayStore.replace(/[+-]+[0-9]*$/g, to + displayPartialStore);
}

//VAR DECLARATION
let displayStore = '0'; //Store what will be showed on display
let displayPartialStore = ''; //Store partially the numbers that were writed on display
let operationStore = []; //Store the complete operations
let display = document.querySelector('.display');
let keypadButtons = Array.from(document.querySelectorAll('.button.keypad'));
let clearButton = document.querySelector('.button.clear');
let equalsButton = document.querySelector('.button.equals');
let operatorButtons =  Array.from(document.querySelectorAll('.operator'));
let commaButton = document.querySelector('.comma');
let deleteButton = document.querySelector('.delete');
let negateButton = document.querySelector('.negate');

//EVENTS
keypadButtons.map(button => button.addEventListener('click', keyPressed));
clearButton.addEventListener('click', clearScreen);
equalsButton.addEventListener('click', equals);
operatorButtons.map(operator => operator.addEventListener('click', operationPressed));
commaButton.addEventListener('click', commaPressed);
deleteButton.addEventListener('click', deletePressed);
negateButton.addEventListener('click', negatePressed);