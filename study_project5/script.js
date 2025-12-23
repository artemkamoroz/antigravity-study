const questions = [
    {
        question: "Какой язык работает в браузере?",
        answers: [
            { text: "Java", correct: false },
            { text: "C++", correct: false },
            { text: "Python", correct: false },
            { text: "JavaScript", correct: true },
        ]
    },
    {
        question: "Что означает CSS?",
        answers: [
            { text: "Central Style Sheets", correct: false },
            { text: "Cascading Style Sheets", correct: true },
            { text: "Cascading Simple Sheets", correct: false },
            { text: "Cars SUVs Sailboats", correct: false },
        ]
    },
    {
        question: "Что такое HTML?",
        answers: [
            { text: "Язык программирования", correct: false },
            { text: "Язык разметки", correct: true },
            { text: "База данных", correct: false },
            { text: "Редактор текста", correct: false },
        ]
    },
    {
        question: "Какой символ используется для ID в CSS?",
        answers: [
            { text: ".", correct: false },
            { text: "#", correct: true },
            { text: "*", correct: false },
            { text: "@", correct: false },
        ]
    },
    {
        question: "Результат: 2 + '2' в JavaScript?",
        answers: [
            { text: "4", correct: false },
            { text: "22", correct: true },
            { text: "NaN", correct: false },
            { text: "Error", correct: false },
        ]
    },
    {
        question: "Куда console.log() выводит данные?",
        answers: [
            { text: "На экран пользователя", correct: false },
            { text: "В консоль разработчика", correct: true },
            { text: "На принтер", correct: false },
            { text: "В базу данных", correct: false },
        ]
    },
    {
        question: "Как объявить переменную в JS?",
        answers: [
            { text: "var / let / const", correct: true },
            { text: "variable", correct: false },
            { text: "v", correct: false },
            { text: "int", correct: false },
        ]
    },
    {
        question: "Что не является тегом HTML?",
        answers: [
            { text: "&lt;div&gt;", correct: false },
            { text: "&lt;p&gt;", correct: false },
            { text: "&lt;font&gt;", correct: false },
            { text: "container", correct: true },
        ]
    },
    {
        question: "Что делать, если код не работает?",
        answers: [
            { text: "Удалить проект", correct: false },
            { text: "Поплакать", correct: false },
            { text: "Гуглить ошибку", correct: true },
            { text: "Переустановить Windows", correct: false },
        ]
    },
    {
        question: "Какой год сейчас на дворе?",
        answers: [
            { text: "1999", correct: false },
            { text: "2024", correct: false },
            { text: "2025", correct: true },
            { text: "2077", correct: false },
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const resultDiv = document.querySelector(".result");
const quizDiv = document.querySelector(".quiz");
const scoreVal = document.getElementById("score-val");
const totalVal = document.getElementById("total-val");
const restartBtn = document.getElementById("restart-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    quizDiv.style.display = "block";
    resultDiv.style.display = "none";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        constbutton = document.createElement("button");
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtons.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = "none";
    nextButton.classList.remove("visible");
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("wrong");
    }

    // Show correct answer anyway if user picked wrong
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true; // Disable all buttons
    });

    // Smoothly reveal Next Button
    nextButton.style.display = "block";
    setTimeout(() => {
        nextButton.classList.add("visible");
    }, 10);
}

function showScore() {
    resetState();
    questionElement.innerHTML = "Quiz Completed!";
    quizDiv.style.display = "none";
    resultDiv.style.display = "block";

    scoreVal.innerText = score;
    totalVal.innerText = questions.length;
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

restartBtn.addEventListener("click", startQuiz);

// Start on load
startQuiz();
