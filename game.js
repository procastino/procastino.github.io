const question = document.getElementById('question');
const questionImage = document.getElementById('questionImage');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const questionBanks = ["electricidade.json","circuitos.json","electronica.json"]
var questionBank = "yy";
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let correctAnswer = 0;

let questions = [];

//Funcion para barallar os choices
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  //return array;
}
// esta chámase desde index.html e garda questionBank no localStorage
function setQuestionBank(bank) {
  questionBank = questionBanks[bank];
  localStorage.setItem('questionBank', questionBank);
}
// esta supoño que se executa sempre, pero creo que non se contradi
// e toma o valor de questionBank do localStorage
questionBank = localStorage.getItem('questionBank');
fetch(questionBank)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions;
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('end.html');
    }
    questionCounter++;
    progressText.innerText = `Pregunta ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;
    questionImage.src = currentQuestion.image;

    //shuffle(choices);
    var numbersIndex = 0;
    var numbers = ['1','2','3','4'];
    shuffle (numbers);
    correctAnswer = numbers.indexOf('1')+1;
    correctAnswer=correctAnswer.toString();
    console.log('answerCorrect ' + correctAnswer);

    choices.forEach((choice) => {
      choice.innerText = currentQuestion['choice' + numbers[numbersIndex]];
      numbersIndex++;
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        console.log('escolla '+selectedAnswer);

        const classToApply =
            selectedAnswer == correctAnswer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
