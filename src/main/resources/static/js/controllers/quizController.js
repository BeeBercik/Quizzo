import {getQuizDetails, submitAnswers} from "../services/quizService.js";
import {renderQuestion, selectQuestion, updateNextButton} from "../ui/question.js";
import generateTestView from "../views/quizView.js";
import generateError from "../ui/errorBar.js";
import startTimer from "../core/timer.js";
import eliminateOption from "../ui/optionEliminator.js";
import initView from "../router.js";

export default async function initTest(code) {
    const testDetails = await getQuizDetails(code);
    if(!testDetails) {
        generateError("Test with such code doesn't exist");
        return -1;
    }
    generateTestView(testDetails);

    const answers = {
        quizId: testDetails.id,
        selectedAnswers: []
    };
    const nextButton = document.getElementById("next-btn");
    const questionCount = testDetails.questions.length;
    const optionsContainer = document.querySelector(".options");
    const eliminated = [];
    let currentQuestion = 0;

    renderQuestion(testDetails.questions[currentQuestion]);
    updateNextButton(nextButton, currentQuestion, questionCount);

    function timeUp() {
        submitAnswers(answers);
        initView("dashboard");
    }
    const timeLabel = document.getElementById("time");
    const stopTimer = startTimer(testDetails.durationTime * 60, timeLabel, timeUp);

    optionsContainer.addEventListener("click", function(e) {
        e.preventDefault();
        if(e.target.disabled) return;
        selectQuestion(optionsContainer, e);
    });

    nextButton.addEventListener("click", function(e) {
        e.preventDefault()
        const savedAnswers = saveAnswer(testDetails, answers);
        if(!savedAnswers) return currentQuestion;

        if(currentQuestion < questionCount - 1) {
            currentQuestion++;
            eliminated.length = 0;
            renderQuestion(testDetails.questions[currentQuestion]);
            updateNextButton(nextButton, currentQuestion, questionCount);
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

function saveAnswer(testDetails, answers) {
    const selected = document.querySelector(".options button.selected");
    if(!selected) {
        generateError("You must choose the answer");
        return false;
    }
    answers.selectedAnswers.push({
        selectedAnswerId: selected.dataset.value
    });
    return true;
}