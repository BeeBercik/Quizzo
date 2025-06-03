import {getTestDetails, submitAnswers} from "../services/quizService.js";
import {renderQuestion, selectQuestion, updateNextButton} from "../ui/question.js";
import generateTestView from "../views/testView.js";
import generateError from "../ui/errorBar.js";
import startTimer from "../core/timer.js";
import eliminateOption from "../ui/optionEliminator.js";
import initView from "../router.js";

export default function initTest(code) {
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
    const stopTimer = startTimer(testDetails.time * 60, timeLabel, submitAnswers, answers);

    optionsContainer.addEventListener("click", function(e) {
        e.preventDefault();
        if(e.target.disabled) return;
        selectQuestion(optionsContainer, e);
    });

    nextButton.addEventListener("click", function(e) {
        e.preventDefault()
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
    });

    document.getElementById("eliminate-option").addEventListener("click", function() {
        const options = document.querySelectorAll(".options .option");

        if(testDetails.eliminationsCount < 1) {
            generateError("You do not have any eliminations left");
            return;
        }
        if(eliminated.length === options.length - 1) {
            generateError("You cannot eliminate all answers");
            return;
        }
       eliminateOption(testDetails, options, eliminated);
    });
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