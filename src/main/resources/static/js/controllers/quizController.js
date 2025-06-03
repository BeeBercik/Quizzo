
import initView from "../main.js";
import {fetchQuizInfo, getTestDetails, submitAnswers} from "../services/quizService.js";
import {codeValidation} from "../validators/codeValidator.js";
import generateAttemptView from "../views/attemptView.js";
import generateWelcomeView from "../views/welcomeView.js";
import {eliminateOption, generateError, renderQuestion} from "../ui.js";
import generateTestView from "../views/testView.js";

export function initWelcome() {
    generateWelcomeView();

    document.getElementsByTagName("form")[0].addEventListener("submit", (e) => {
        e.preventDefault();
        const code = document.getElementById("code").value.trim();
        if(!codeValidation(code)) return -1;
        initView("attempt", code);
    });
}

export function initAttempt(code) {
    if(!codeValidation(code)) return -1;

    const quizInfo = fetchQuizInfo(code);
    if(!quizInfo) {
        generateError("Test with such code doesn't exist");
        return -1;
    }
    generateAttemptView(quizInfo);

    document.getElementsByClassName("cancel-btn")[0].addEventListener("click", () => {
        initView("welcome");
    });

    document.getElementsByClassName("enter-btn")[0].addEventListener("click", () => {
        initView("test", code);
    });
}

export function initTest(code) {
    const testDetails = getTestDetails(code);
    if(!testDetails) {
        generateError("Test with such code doesn't exist");
        return -1;
    }

    generateTestView(testDetails);

    const answers = {};
    const nextButton = document.getElementById("next-btn");
    const questionCount = testDetails.questions.length;
    const optionsContainer = document.querySelector(".options");
    let current = 0;
    const eliminated = [];

    renderQuestion(testDetails.questions[current]);
    updateNextButton(nextButton, current, questionCount);

    const timeLabel = document.getElementById("time");
    const stopTimer = startTimer(testDetails.time * 60, timeLabel, submitAnswers);

    optionsContainer.addEventListener("click", function(e) {
        selectQuestion(optionsContainer, e);
    });

    nextButton.addEventListener("click", function(e) {
        current = switchQuestion(testDetails,
            current,
            questionCount,
            answers,
            nextButton,
            eliminated,
            stopTimer,
            e);
    });

    document.getElementById("eliminate-option").addEventListener("click", function() {
       eliminateOption(testDetails, optionsContainer, eliminated);
    });

}

function startTimer(totalSeconds, displayEl, submitAnswers) {
    let remaining = totalSeconds;

    updateDisplay(remaining, displayEl);

    const intervalId = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            clearInterval(intervalId);
            updateDisplay(0, displayEl);
            submitAnswers();
            initView("dashboard");
        } else {
            updateDisplay(remaining, displayEl);
        }
    }, 1000);


    return () => clearInterval(intervalId);

    function updateDisplay(sec, el) {
        const min = Math.floor(sec / 60);
        const s = sec % 60;

        const mm = min.toString().padStart(2, "0");
        const ss = s.toString().padStart(2, "0");
        el.textContent = `${mm}:${ss}`;
    }
}

function selectQuestion(options, e) {
    e.preventDefault();
    if(e.target.disabled) return;

    const previousSelected = options.querySelectorAll("button.selected");
    for(const element of previousSelected) {
        element.classList.remove("selected");
    }
    e.target.classList.add("selected");
}

function switchQuestion(testDetails,
                        current,
                        questionCount,
                        answers,
                        nextButton,
                        eliminated,
                        stopTimer,
                        e) {
    e.preventDefault();

    const saved = saveAnswer(testDetails, answers, current);
    if(!saved) return current;
    if(current < questionCount - 1) {
        current++;
        eliminated.length = 0;
        renderQuestion(testDetails.questions[current]);
        updateNextButton(nextButton, current, questionCount);
    } else {
        stopTimer();
        submitAnswers(answers);
        initView("dashboard");
    }
    return current;
}

function updateNextButton(button, current, total) {
    if(current < total - 1) button.textContent = "Next";
    else button.textContent = "Finish";
}

function saveAnswer(testDetails, answers, current) {
    const selected = document.querySelector(".options button.selected");
    if(!selected) {
        generateError("You must choose the answer");
        return false;
    }
    answers[testDetails.questions[current].id] = selected.dataset.value;
    return true;
}