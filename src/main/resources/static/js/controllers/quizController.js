
import initView from "../main.js";
import {fetchQuizInfo, getTestDetails} from "../services/quizService.js";
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
    let current = 0;
    renderQuestion(testDetails.questions[current]);

    const button = document.getElementById("next-btn");
    const questionCount = testDetails.questions.length;
    updateNextButton(button, current, questionCount);
    current++;

    button.addEventListener("click", function(e) {
        e.preventDefault();
        renderQuestion(testDetails.questions[current]);
        updateNextButton(button, current, questionCount);
        current++;
    });

    document.getElementById("eliminate-option").addEventListener("click", function() {
    //     ...
    });

    // timer ...
}

function updateNextButton(button, current, total) {
    if(current < total - 1) button.textContent = "Next";
    else button.textContent = "Finish";
}