//HTML hookup variables
var userGuess = document.getElementById("userGuess"); //TODO link to show past wrong guess
var userAnswer = document.getElementById("userAnswer"); //TODO link to show users right guesses
var userWins = document.getElementById("win"); 
var userLoss = document.getElementById("lose"); 
var userTries = document.getElementById("tries"); 
var instructions = document.getElementById("instructions");
var img = document.getElementById("picture");
var message = document.getElementById("message");
var inputField = document.getElementById("textInput");

//Object Class that holds the game core data
var gameCore = {
    
    winCount: 0,
    loseCount: 0,
    triesLeft: 10,
    wordList: ['T REX', 'DROMICEIOMIMUS', 'UTAH RAPTOR', 'BATMAN', 'GOD', 'SATAN', 
                'TINY WOMAN', 'RACCOONS' , 'CEPHALOPODS', 'RYAN NORTH'], //list of words for game
    imgList: ['T-Rex2.png', 'Dromiceiomimus.png', 'Utah-Raptor.png', 'Batman.jpg', 'God.jpg', 
                'Satan.jpg', 'Tiny-Woman.png', 'Raccoons.jpg', 'Cephalopods.jpg', 'Ryan-North.jpg'], //list image reference
    answers: "",
    imageSrc: "",
    displayWord: [], //empty list to display word as '_' and to compare with answers
    incorrectGuess: [], //empty list to hold letters that the user guessed wrong
    correctGuess: [], //empty list to hold letters that the user guessed right

    gameStart: false, //trigger flag for press anykey

    gameReset: function() {
        //resets the guess list and number of tries
        this.triesLeft = 10;
        this.incorrectGuess = [];
        this.correctGuess = [];
        this.displayWord = [];

        //randomly choose new word from list of game words
        var ranNum = Math.floor(Math.random() * this.wordList.length)
        this.answers = this.wordList[ranNum];
        this.imageSrc = this.imgList[ranNum];
        //console.log(this.answers); //DEBUG CODE// GAME CHEAT REMOVE WHEN DONE
        this.displayWordBlank();

        message.textContent = "Hurry Up. Hurry. OMG HURRY.";
        userGuess.textContent = "You Guessed: ";
        userTries.textContent = this.triesLeft;
        inputField.value = ""; //make sure field is blank upon reset
    },

    pastGuess: function(letter, state) {
        //populate incorrectGuess or correctGuess lists with the user's previous guesses
        if (state == 1){
            //correct guess
            this.correctGuess.push(letter);
        }
        else if (state == 2){
            //incorrect guess
            this.incorrectGuess.push(letter);
        }
    },

    displayWordBlank: function() {
        //display answer word as '_ '
        for (i=0; i<this.answers.length; i++){
            if (isAlpha(this.answers.charCodeAt(i))){
                this.displayWord.push('_');
            }
            else{
                //if the element is not AlphaNumeric leave as is
                this.displayWord.push(this.answers[i]);
            }
        }
        userAnswer.textContent = "";
        for (j=0; j<this.displayWord.length; j++){
            userAnswer.textContent += (this.displayWord[j] + "\xa0"); 
        }
    },
};

//functions
function isAlpha(keyCode){
    /*function checks if input (event.keyCode) is AlphaNumeric, returns true or false
    keyCode 48-57 (0-9), 65-90 (A-Z)
    note: keyboard input 65-90 (A-Z == a-Z)*/
    return ((keyCode >= 65 && keyCode <= 90)||(keyCode >= 97 && keyCode <= 122));
}

function isInWord(letter){
    //takes a 'string' and returns true if it is part of the answer, false otherwise
    return (gameCore.answers.indexOf(letter) != -1);
}

function replaceBlank(letter){
    //replace '_ ' with the correct letter according to answers and display them
    for (i=0; i<gameCore.displayWord.length; i++){
        if (letter == gameCore.answers[i]){
            gameCore.displayWord[i] = letter;
        }
    }
    userAnswer.textContent = "";
    for (j=0; j<gameCore.displayWord.length; j++){
        userAnswer.textContent += (gameCore.displayWord[j] + "\xa0"); 
    } 
}

function checkAnswer(){
    //checks if the user got the whole word
    //returns true if match, false otherwise
    var inputWord = "";
    for (i=0; i<gameCore.displayWord.length; i++){
        inputWord += gameCore.displayWord[i];
    }
    return (inputWord == gameCore.answers);
}

//main
//detects a key up event to start or run game
document.onkeyup = function(event){
    if (gameCore.gameStart == false){
        //game hasn't started, 'press anykey event' flag
        inputField.value = ""; //redundant code to ensure field is blank
        gameCore.gameStart = true;
        instructions.textContent = "Please enter a letter";
        gameCore.gameReset();
    }
    else if(checkAnswer()){
        //user wins
        gameCore.gameReset();
        instructions.textContent = "Please enter a letter";
    }
    else if (gameCore.triesLeft > 0){
        //round is not over
        var userInput;
        var inputCode;
        if (inputField.value!=""){
            userInput = inputField.value;
            inputCode = userInput.charCodeAt(0);
            inputField.value = ""; //reset input box
        }
        else{
            userInput = event.key;
            inputCode = event.keyCode;
        }
        //var userInput = event.key;
        //check for valid input
        if(isAlpha(inputCode)){
            var inputUpper = userInput.toUpperCase();
            //valid input, start comparing, ignore cases of repeted letter guess
            if (isInWord(inputUpper) && (gameCore.correctGuess.indexOf(inputUpper)==-1)){
                gameCore.pastGuess(inputUpper, 1);
                replaceBlank(inputUpper);
                inputField.value = ""; //redundant code to ensure field is blank

                if(checkAnswer()){
                    //user win condition, 
                    //this is here so user can see the final word
                    gameCore.winCount++;
                    userWins.textContent = gameCore.winCount;
                    message.textContent = "Lucky Guess! Pfft, Whatevs.";
                    instructions.textContent = "Enter any key to continue";
                    img.src = "assets/images/" + gameCore.imageSrc;
                }
            }
            else if ((gameCore.incorrectGuess.indexOf(inputUpper)==-1) && (gameCore.correctGuess.indexOf(inputUpper)==-1)){
                gameCore.pastGuess(inputUpper, 2);
                gameCore.triesLeft--;

                if(gameCore.triesLeft == 0){
                    instructions.textContent = "Enter any key to continue";
                    message.textContent = "The Answer Was Totally: " + gameCore.answers;
                }

                //link values to HTML
                userGuess.textContent += (inputUpper + "\xa0");
                userTries.textContent = gameCore.triesLeft;
                inputField.value = ""; //redundant code to ensure field is blank
            }
        }
        else{
            //invalid input
            alert("Please press only letters, you CLOWN!");
            inputField.value = "";
        }

    }
    else{
        //round lost
        gameCore.gameReset();
        gameCore.loseCount++;
        userLoss.textContent = gameCore.loseCount;
    }
}