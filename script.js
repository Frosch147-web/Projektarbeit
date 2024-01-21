
// html elements
const container = document.getElementById("container");
var lines = document.getElementsByClassName("line");
var blocks = document.getElementsByClassName("block");
var movementSpeedInput = document.getElementById("range");

const dialog = document.querySelector("dialog");
const scoreDialog = document.getElementById("scoreDialog");

// Declare relevant variables 
var numOfBlocks = 20;
var Score;
var movementSpeed;
var interval;
var snakeNow;
var food;
var bResult = false;
var maxMove = numOfBlocks * numOfBlocks - 1;
// Create Grid Layout
// Create lines
for (l = 0; l < numOfBlocks; l++) {
    var line = document.createElement("div");
    container.appendChild(line).className = "line";
};
//Create blocks
for (i = 0; i < numOfBlocks; i++) {
    for (c = 0; c < numOfBlocks; c++) {
        var newBlock = document.createElement("div");
        lines[c].appendChild(newBlock).className = "block";
    };
}
function startGame() {
    // set score to 0
    Score = 0;
    // get movement speed
    movementSpeed = movementSpeedInput.value;
    createSnake();
    createFood();
}
// create snake and set snake array
function createSnake() {
    // snake array
    snakeNow = [44, 45, 46];

    // create first snake
    for (s = 0; s < snakeNow.length; s++) {
        // get array element
        snakeCell = snakeNow[s];
        // set color of corresponding cell to green 
        blocks[snakeCell].style.background = "rgb(143, 224, 22)";
    }

}

// create first food block and set color
function createFood() {
    food = 85;
    blocks[food].style.background = "red";
}
// check if selected block to be next food is already in snake array
function checkFoodBlock() {
    // iterate as long as snake length
    for (f = 0; f < snakeNow.length; f++) {
        // check if selected snake array entry equals new food value 
        if (snakeNow[f] == food) {
            return true;
        }
    }
}
// checks if food is being eaten and handles eating process
function eating() {

    // check if snake is eating food
    if (snakeNow[0] == food) {

        // increment score depending on movement speed
        if (movementSpeed > 10000) {
            Score = Score + 10;
        }
        else if (movementSpeed > 1000) {
            Score = Score + 100;
        }
        else if (movementSpeed > 100) {
            Score = Score + 1000;
        }

        // Update Score Display
        document.querySelector("span").textContent = Score;

        // add new block to snake array
        var indexLastElement = snakeNow.length - 1;
        snakeNow.push(snakeBefore[indexLastElement]);
        food = Math.floor(Math.random() * maxMove);

        // generate new food block if food is trying to spawn in snake
        while (checkFoodBlock()) {
            food = Math.floor(Math.random() * maxMove);
        }
        // set new food block to red
        blocks[food].style.background = "red";
    }
}
// move snake
function movingSnake(move) {

    // get movement speed
    movementSpeed = movementSpeedInput.value;

    // call function 
    checkWrongMove(move);

    // set num to first entry of snake array
    num = snakeNow[0];

    // checks if move is to the left and first snake entry is first entry in a row
    if (move == -1 && num % numOfBlocks == 0) {
        bResult = true;
    }

    // checks if move is to the right
    if (move == +1) {
        // increment num by 1
        num = num + 1;
        // return true if first snake array entry is last entry in a row
        if (num % numOfBlocks == 0) {
            bResult = true;
        }
    }

    // check if snake is trying to move out of grid
    if (snakeNow[0] + move > maxMove || snakeNow[0] + move < 0 || bResult) {
        // moving out of grid triggers game ending mechanics
        clearInterval(interval);
        bResult = false;
        gameover();

    } else {

        //create array to store old array values
        snakeBefore = [];
        // store array element 0 value
        snakeBefore[0] = snakeNow[0];
        // move array element to new location
        snakeNow[0] = snakeNow[0] + move;
        // color new location green
        cs = snakeNow[0];
        blocks[cs].style.background = "rgb(143, 224, 22)";
        // get last array element
        var indexLastElement = snakeNow.length - 1;
        // color last array element cell black
        valueLastElement = snakeNow[indexLastElement];
        blocks[valueLastElement].style.background = "black";
        // iterate over snake array entries from index 1
        for (s = 1; s < snakeNow.length; s++) {
            // store entries in Before array
            snakeBefore[s] = snakeNow[s];
            // set snake array entry to the old array of the entry before it
            snakeNow[s] = snakeBefore[s - 1];
        }

        // call eating function to check if snake is moving on food block
        eating();
    }

}

// check if snake is trying to move on top of itself
function checkWrongMove(move) {
    // iterate over all snake elements
    for (w = 0; w < snakeNow.length; w++) {
        // check if new place of snake would move on top of any part of the snake
        if (snakeNow[0] + move == snakeNow[w]) {
            // call gameover function
            gameover();
        }
    }
}

// function to handle 
function gameover() {

    // make whole grid black
    for (i = 0; i < 100; i++) {
        blocks[i].style.background = "black";
    }

    // set Score for Dialog
    scoreDialog.textContent = "Score: " + Score;
    dialog.showModal();

}


function restart() {
    // reload page
    location.reload();
    // call start game function
    startGame();
}


// call startGame function
startGame();

// check arrow events
document.addEventListener("keydown", waitForArrowKey);

function waitForArrowKey(e) {

    // check if move is allowed
    //checkWrongMove();

    if (e.keyCode == '38') {
        // up arrow

        // move up equals subtracting the number of cells in a row
        move = -numOfBlocks;

        // call gameover function when trying to make not allowed move
        if (checkWrongMove(move)) {
            gameover();
        }

        // move snake along set move direction with the set movement speed
        var interval = setInterval(function () { movingSnake(move); }, movementSpeed);

        // add another Event Listener for other Arrow Keys
        document.addEventListener("keydown", waitForArrowKeyAfter);
        function waitForArrowKeyAfter(e) {
            // check if other arrow keys are being pressed
            if (e.keyCode == '40' || '37' || '39') {
                clearInterval(interval);
            }
            // check if snake is moving on top of himself or if trying to move out of grid
            else if (bResult || checkWrongMove(move)) {
                clearInterval(interval);
                gameover();
            }
        }

    }
    else if (e.keyCode == '40') {
        // down arrow

        // set move to number of cells in a row
        move = +numOfBlocks;

        // check if move is not allowed
        if (checkWrongMove(move)) {
            clearInterval(interval);
            gameover();
        }
        else {
            // move snake along set move direction with the set movement spe
            var interval = setInterval(function () { movingSnake(move); }, movementSpeed);
            document.addEventListener("keydown", waitForArrowKeyAfter);

            function waitForArrowKeyAfter(e) {
                // check if other arrow keys are being pressed
                if (e.keyCode == '38' || '37' || '39') {
                    clearInterval(interval);
                }
                // check if snake is moving on top of himself or if trying to move out of grid
                else if (bResult || checkWrongMove(move)) {
                    clearInterval(interval);
                    gameover();
                }
            }
        }

    }
    else if (e.keyCode == '37') {
        // left arrow

        // move on cell to the left
        move = -1;

        // check if move is not allowed
        if (checkWrongMove(move)) {
            clearInterval(interval);
            gameover();

        } else {
            // move snake along set move direction with the set movement speed
            var interval = setInterval(function () { movingSnake(move); }, movementSpeed);
            document.addEventListener("keydown", waitForArrowKeyAfter);

            function waitForArrowKeyAfter(e) {
                // check if other arrow keys are being pressed
                if (e.keyCode == '38' || '37' || '40') {
                    clearInterval(interval);
                    // check if snake is moving on top of himself or if trying to move out of grid
                } else if (bResult || checkWrongMove(move)) {
                    clearInterval(interval);
                    gameover();
                }
            }
        }
    }
    else if (e.keyCode == '39') {
        // right arrow

        // move one cell to the right
        move = +1;

         // check if move is not allowed
        if (checkWrongMove(move)) {
            clearInterval(interval);
            gameover();

        } else {
            // move snake along set move direction with the set movement spe
            var interval = setInterval(function () { movingSnake(move); }, movementSpeed);
            document.addEventListener("keydown", waitForArrowKeyAfter);

            function waitForArrowKeyAfter(e) {
                // check if other arrow keys are being pressed
                if (e.keyCode == '38' || '37' || '40') {
                    clearInterval(interval);
                    // check if snake is moving on top of himself or if trying to move out of grid
                } else if (bResult || checkWrongMove(move)) {
                    clearInterval(interval);
                    gameover();
                }
            }
        }

    }

}




