
import initView from "../main.js";
import {fetchQuizInfo, getTestDetails, submitAnswers} from "../services/quizService.js";
import {codeValidation} from "../validators/codeValidator.js";
import generateAttemptView from "../views/attemptView.js";
import generateWelcomeView from "../views/welcomeView.js";
import {generateError, renderQuestion} from "../ui.js";
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
    if(!testDetails) { // w miedzy czasie usunieto (gdy na attempt)
        generateError("Test with such code doesn't exist");
        return -1;
    }

    generateTestView(testDetails);

    const answers = {};
    const nextButton = document.getElementById("next-btn");
    const questionCount = testDetails.questions.length;
    const options = document.querySelector(".options");
    let current = 0;

    // SELECTING
    options.addEventListener("click", function(e) {
        e.preventDefault();

        const previousSelected = options.querySelectorAll("button.selected");
        for(const element of previousSelected) {
            element.classList.remove("selected");
        }

        e.target.classList.add("selected");
    });

    renderQuestion(testDetails.questions[current]);
    updateNextButton(nextButton, current, questionCount);

    // SWITCHING
    nextButton.addEventListener("click", function(e) {
        e.preventDefault();

        const saved = saveAnswer(testDetails, answers, current);
        if(!saved) return;
        if(current < questionCount - 1) {
            current++;
            renderQuestion(testDetails.questions[current]);
            updateNextButton(nextButton, current, questionCount);
        } else {
            submitAnswers(answers);
            initView("dashboard");
        }
    });

    // ELIMINATING
    document.getElementById("eliminate-option").addEventListener("click", function() {
    //     ...
    });

    // timer ...
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